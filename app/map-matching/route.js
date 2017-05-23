/* global L */

import Ember from 'ember';
import setLoading from 'mobility-playground/mixins/set-loading';
import xml2js from 'npm:xml2js';
import polylineEncoded from 'npm:polyline-encoded';

export default Ember.Route.extend(setLoading, {
	queryParams: {
		trace: {
			replace: true,
			refreshModel: true
		},
		costing: {
			replace: false,
			refreshModel: true
		}
	},

	setupController: function (controller, model) {
		if (controller.get('bbox') !== null){
			var coordinateArray = [];
			var bboxString = controller.get('bbox');
			var tempArray = [];
			var boundsArray = [];

			coordinateArray = bboxString.split(',');

			for (var i = 0; i < coordinateArray.length; i++){
				tempArray.push(parseFloat(coordinateArray[i]));
			}

			var arrayOne = [];
			var arrayTwo = [];
			arrayOne.push(tempArray[1]);
			arrayOne.push(tempArray[0]);
			arrayTwo.push(tempArray[3]);
			arrayTwo.push(tempArray[2]);
			boundsArray.push(arrayOne);
			boundsArray.push(arrayTwo);
			controller.set('leafletBounds', boundsArray);

		}
		controller.set('leafletBbox', controller.get('bbox'));
		this._super(controller, model);
	},

	fixtures: function() {
		let gpxTraces = [
			{
				"name": "san-francisco-run",
				"display_name": "Run in San Francisco",
				"filename": "san-francisco-run.gpx",
				"costing": "pedestrian"
			},
			{
				"name": "dc-run",
				"display_name": "Run in Washington, DC",
				"filename": "dc-run.gpx",
				"costing": "pedestrian"
			},
			{
				"name": "pennsylvania-drive",
				"display_name": "Drive in Pennsylvania",
				"filename": "Pennsylvania-drive.gpx",
				"costing": "auto"
			},
			{
				"name": "maryland-bike-ride",
				"display_name": "Bike ride in Maryland",
				"filename": "maryland-bike-ride.gpx",
				"costing": "bicycle"
			},
			{
				"name": "user_upload",
				"display_name": "Match your own GPX file...",
				"filename": "",
				"costing": "",
				"error_message": ""
			}
		];
		return gpxTraces;
	},

	getLocalGPX: function(gpxTrace) {
		// might want to use RSVP.promise here instead of RSVP.defer
		var deferred = Ember.RSVP.defer();
		var element = document.getElementById('gpxFileUpload');
		var uploadedTrace = element.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
		  deferred.resolve(e.target.result);
		};
		reader.onerror = function(e) {
			deferred.reject(this);
		};
		reader.readAsText(uploadedTrace);
		return deferred.promise;
	},

	getRemoteGPX: function(gpxTrace) {
		return Ember.$.ajax({
			type: "GET",
			contentType: "text/xml",
			url: 'assets/traces/' + gpxTrace.filename,
		})
		.then(function(response) {
			// look into xpath to query xml dom
			if (typeof(response) === "string"){
				return response;
			} else {
				var s = new XMLSerializer();
				var str = s.serializeToString(response);
				return str;
			}
		});
	},

	getGPXTrace: function(gpxTrace) {
		if (gpxTrace.name === 'user_upload') {
			return this.getLocalGPX(gpxTrace);
		} else {
			return this.getRemoteGPX(gpxTrace);
		}
	},

	model: function(params){
		if (document.getElementById('gpxFileUpload') === null){
			if (params.costing !== null){
				this.transitionTo('map-matching',  {queryParams: {trace: null, costing: null}});
			}
			if (params.trace === "user_upload"){
				this.transitionTo('map-matching',  {queryParams: {trace: null, costing: null}});
			}
		}
		this.store.unloadAll('data/transitland/operator');
		this.store.unloadAll('data/transitland/stop');
		this.store.unloadAll('data/transitland/route');
		this.store.unloadAll('data/transitland/route_stop_pattern');
		// Get the gpxTrace fixture
		var fixtures = this.fixtures();
		var gpxTrace;
		var mapMatchRequests = null;
		var traceRouteRequest = null;
		var element = document.getElementById('gpxFileUpload');

		if (params.trace !== null && params.trace !== 'user_upload') {
			for (var i = 0; i < fixtures.length; i++){
				if (fixtures[i].name === params.trace){
					gpxTrace = fixtures[i];
				}
			}
		} else if (element != null) {
			var uploadedTrace = element.files[0];
			if (uploadedTrace != null) {
				fixtures[fixtures.length - 1].display_name = "your GPX file";
				fixtures[fixtures.length - 1].costing = params.costing;
				gpxTrace = fixtures[fixtures.length - 1];
			}
		}

		if (gpxTrace) {
			mapMatchRequests = this.getGPXTrace(gpxTrace).then(function(response){
				gpxTrace.coordinates = [];
				var gpxObj;

				xml2js.parseString(response, function (err, result){
					if(err){
						return gpxObj = "error";
					}
					gpxObj = result.gpx.trk;
				});
				if (gpxObj === "error"){
					gpxTrace.error_message = "error";
					return gpxTrace;
				}
				gpxObj[0].trkseg[0].trkpt.map(function(coord){
					gpxTrace.coordinates.push([parseFloat(coord.$.lat),parseFloat(coord.$.lon)]);
				});

				gpxTrace.startLocation = gpxTrace.coordinates[0];
				gpxTrace.endLocation = gpxTrace.coordinates[gpxTrace.coordinates.length - 1];

				return gpxTrace;
			}).then(function(gpxTrace){
				if (gpxTrace.error_message === "error"){
					return gpxTrace;
				}
				var bounds = L.latLngBounds(gpxTrace.coordinates);
				var boundsArray = [[bounds._southWest.lat, bounds._southWest.lng],[bounds._northEast.lat,bounds._northEast.lng]];
     		gpxTrace.bounds = boundsArray;
     		var attributesJson = {};

				// UPDATE: Build the trace_attribute request
				var attributesJson = {};
				if (gpxTrace.costing === "bicycle" || params.costing === "bicycle"){
					attributesJson = {
						"shape": [],
						"costing": "bicycle",
						"costing_options":{"bicycle":{"bicycle_type":"Mountain"}},
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
					};
				} else if (params.trace === "san-francisco-run"){
				  attributesJson = {
						"shape": [],
						"costing": gpxTrace.costing,
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
						// only for marathon
						"trace_options":{"turn_penalty_factor":500}
					};
				} else {
					attributesJson = {
						"shape": [],
						"costing": gpxTrace.costing,
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
					};
				}

				gpxTrace.coordinates.map(function(coord){
					attributesJson.shape.push({"lat":coord[0],"lon":coord[1]});
				});

				// trace_attributes request
				return Ember.$.ajax({
					type:"POST",
					url:'https://valhalla.mapzen.com/trace_attributes?api_key=mapzen-jLrDBSP&',
					data:JSON.stringify(attributesJson)
				});
			})
			.then(function(response){
				if (response.error_message === "error"){
					return "trace error";
				}
				var attributesResponse = response;
				// encodedPolyline needed for trace_attribute request
				var encodedPolyline = response.shape;
				// decodedPolyline needed for rendering trace_route response on map
				var decodedPolyline = L.PolylineUtil.decode(encodedPolyline, 6);
				
				// // Build the trace_route request	
				var routeJson = {};
				if (gpxTrace.costing === "bicycle" || params.costing === "bicycle"){
					routeJson = {
						"encoded_polyline": encodedPolyline,
						"costing": "bicycle",
						"costing_options":{"bicycle":{"bicycle_type":"Mountain"}},
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
					};
				} else if (params.trace === "san-francisco-run"){
				  routeJson = {
						"encoded_polyline": encodedPolyline,
						"costing": gpxTrace.costing,
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
						// only for marathon
						"trace_options":{"turn_penalty_factor":500}
					};
				} else {
					routeJson = {
						"encoded_polyline": encodedPolyline,
						"costing": gpxTrace.costing,
						"directions_options":{"units":"miles"},
						"shape_match": "map_snap",
					};
				}

				var traceRouteRequest = Ember.$.ajax({
					type: "POST",
					url:'https://valhalla.mapzen.com/trace_route?api_key=mapzen-jLrDBSP&',
					data: JSON.stringify(routeJson)
				});
				
				return Ember.RSVP.hashSettled({
					decodedPolyline: decodedPolyline,
					encodedPolyline: encodedPolyline,
					attributesResponse: attributesResponse,
					traceRouteRequest: traceRouteRequest
				});
				
			}, function(error) {
				return {"error": error.responseJSON.error};
			});
		}
		// if (gpxTrace) {
		// 	traceRouteRequest = this.getGPXTrace(gpxTrace).then(function(response){
		// 		gpxTrace.coordinates = [];
		// 		var gpxObj;

		// 		xml2js.parseString(response, function (err, result){
		// 			if(err){
		// 				return gpxObj = "error";
		// 			}
		// 			gpxObj = result.gpx.trk;
		// 		});
		// 		if (gpxObj === "error"){
		// 			gpxTrace.error_message = "error";
		// 			return gpxTrace;
		// 		}
		// 		gpxObj[0].trkseg[0].trkpt.map(function(coord){
		// 			gpxTrace.coordinates.push([parseFloat(coord.$.lat),parseFloat(coord.$.lon)]);
		// 		});

		// 		gpxTrace.startLocation = gpxTrace.coordinates[0];
		// 		gpxTrace.endLocation = gpxTrace.coordinates[gpxTrace.coordinates.length - 1];

		// 		return gpxTrace;
		// 	}).then(function(gpxTrace){
		// 		if (gpxTrace.error_message === "error"){
		// 			return gpxTrace;
		// 		}
		// 		var routeJson = {};
		// 		if (gpxTrace.costing === "bicycle" || params.costing === "bicycle"){
		// 			routeJson = {
		// 				"shape": [],
		// 				"costing": "bicycle",
		// 				"costing_options":{"bicycle":{"bicycle_type":"Mountain"}},
		// 				"directions_options":{"units":"miles"},
		// 				"shape_match": "map_snap",
		// 			};
		// 		} else if (params.trace === "san-francisco-run"){
		// 		  routeJson = {
		// 				"shape": [],
		// 				"costing": gpxTrace.costing,
		// 				"directions_options":{"units":"miles"},
		// 				"shape_match": "map_snap",
		// 				// only for marathon
		// 				"trace_options":{"turn_penalty_factor":500}
		// 			};
		// 		} else {
		// 			routeJson = {
		// 				"shape": [],
		// 				"costing": gpxTrace.costing,
		// 				"directions_options":{"units":"miles"},
		// 				"shape_match": "map_snap",
		// 			};
		// 		}

		// 		gpxTrace.coordinates.map(function(coord){
		// 			routeJson.shape.push({"lat":coord[0],"lon":coord[1]});
		// 		});
		// 		var routeRequest = Ember.$.ajax({
		// 			type: "POST",
		// 			url:'https://valhalla.mapzen.com/trace_route?api_key=mapzen-jLrDBSP&',
		// 			data: JSON.stringify(routeJson)
		// 		});
		// 		return routeRequest;
		// 	});
		// }

    // Issue promise with both gpxTrace model and trace_route request
		return Ember.RSVP.hash({
			gpxTraces: fixtures,
			gpxTrace: gpxTrace,
			mapMatchRequests: mapMatchRequests,
			// traceRouteRequest: traceRouteRequest
		});
	},

	actions: {
	}
});
