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
				"name": "half-marathon",
				"display_name": "half marathon",
				"filename": "half-marathon.gpx",
				"costing": "pedestrian",
				"center": [37.787859, -122.454815]
			},
			{
				"name": "short-run",
				"display_name": "short run",
				"filename": "short-run.gpx",
				"costing": "pedestrian",
				"center": [37.7546595, -122.5091065]
			},
			{
				"name": "mountain-bike-1",
				"display_name": "mountain bike 1",
				"filename": "mountain-bike-1.gpx",
				"costing": "bicycle",
				"center": [37.399614, -122.304894]
			},
			{
				"name": "mountain-bike-2",
				"display_name": "mountain bike 2",
				"filename": "mountain-bike-2.gpx",
				"costing": "bicycle",
				"center": [37.399614, -122.304894]
			},
			{
				"name": "mountain-bike-3",
				"display_name": "mountain bike 3",
				"filename": "mountain-bike-3.gpx",
				"costing": "bicycle",
				"center": [37.399614, -122.304894]
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
		}
		reader.readAsText(uploadedTrace);
		return deferred.promise;
	},

	getRemoteGPX: function(gpxTrace) {
		return Ember.$.ajax({
			type: "GET",
			contentType: "text/xml",
			url: 'assets/traces/' + gpxTrace.filename,
		})
		// test for dev:
		// .then(function(response) {
		// 	// look into xpath to query xml dom
		// 	var s = new XMLSerializer();
		// 	var str = s.serializeToString(response);
		// 	return str;
		// })
	},

	getGPXTrace: function(gpxTrace) {
		if (gpxTrace.name == 'user_upload') {
			return this.getLocalGPX(gpxTrace);
		} else {
			return this.getRemoteGPX(gpxTrace);	
		}
	},

	model: function(params){
		if (document.getElementById('gpxFileUpload') === null){
			if (params.trace === "user_upload"){
				this.transitionTo('map-matching',  {queryParams: {trace: null}});
			}
		};
		this.store.unloadAll('data/transitland/operator');
		this.store.unloadAll('data/transitland/stop');
		this.store.unloadAll('data/transitland/route');
		this.store.unloadAll('data/transitland/route_stop_pattern');
		// Get the gpxTrace fixture
		var fixtures = this.fixtures();
		var gpxTrace;
		var mapMatchRequests = null;

		var element = document.getElementById('gpxFileUpload');
		if (params.trace != null && params.trace != 'user_upload') {
			for (var i = 0; i < fixtures.length; i++){
				if (fixtures[i].name === params.trace){
					gpxTrace = fixtures[i];
				}
			}
		} else if (element != null) {
			var uploadedTrace = element.files[0];
			if (uploadedTrace != null) {
				fixtures.push({
					"name": "user_upload",
					"display_name": "user upload",
					"filename": "",
					"costing": "pedestrian",
					"center": [37.787859, -122.454815]
				});
				gpxTrace = fixtures[5]
			}
		}

		if (gpxTrace) {
			var mapMatchRequests = this.getGPXTrace(gpxTrace).then(function(response){
				gpxTrace.coordinates = [];
				var gpxObj;
				// 112 & 114 should be rewritten using xpath
				xml2js.parseString(response, function (err, result){
					gpxObj = result.gpx.trk;
				});
				gpxObj[0].trkseg[0].trkpt.map(function(coord){
					gpxTrace.coordinates.push([parseFloat(coord.$.lat),parseFloat(coord.$.lon)]);
				});
				gpxTrace.startLocation = gpxTrace.coordinates[0];
				gpxTrace.endLocation = gpxTrace.coordinates[gpxTrace.coordinates.length - 1];
				return gpxTrace;
			}).then(function(gpxTrace){
				// Build the trace_route request
				var routeJson = {
					"shape": [],
					"costing": gpxTrace.costing,
					// "shape_match":"walk_or_snap",
					"shape_match": "map_snap",
					// "filters": {"attributes":["edge.names","edge.id","edge.weighted_grade","edge.speed"],"action":"include"}
				};

				gpxTrace.coordinates.map(function(coord){
					routeJson.shape.push({"lat":coord[0],"lon":coord[1]});
				});
				// trace_route request
				return Ember.$.ajax({ 
					type:"POST", 
					url:'https://valhalla.mapzen.com/trace_route?api_key=mapzen-jLrDBSP&', 
					data:JSON.stringify(routeJson) 
				});
			})
			.then(function(response){
				// encodedPolyline needed for trace_attribute request
				var encodedPolyline = response.trip.legs[0].shape;
				// decodedPolyline needed for rendering trace_route response on map
				var decodedPolyline = L.PolylineUtil.decode(encodedPolyline, 6);

				// Build the trace_attribute request
				var attributesJson = {
					"encoded_polyline": encodedPolyline,
					"costing": gpxTrace.costing,
					"shape_match": "walk_or_snap",
					// "filters":{"attributes":["edge.weighted_grade", "shape"],"action":"include"}
				};
				var attributesRequest = Ember.$.ajax({
					type: "POST",
					url:'https://valhalla.mapzen.com/trace_attributes?api_key=mapzen-jLrDBSP&',
					data: JSON.stringify(attributesJson)
				});
				return Ember.RSVP.hash({
					decodedPolyline: decodedPolyline,
					attributesRequest: attributesRequest
				});
			});
		}
    // Issue promise with both gpxTrace model and trace_route request
		return Ember.RSVP.hash({
			gpxTraces: fixtures,
			gpxTrace: gpxTrace,
			mapMatchRequests: mapMatchRequests
		})
		// .then(function(r){
		// 	return r 
		// });
	},

	actions: {
	}
});