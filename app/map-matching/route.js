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
		style_attribute: {
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
					"name": "short run",
					"filename": "run.gpx",
					"costing": "pedestrian",
					"center": [37.7546595, -122.5091065]
				},
				{
					"name": "half marathon",
					"filename": "half-marathon.gpx",
					"costing": "bicycle",
					"center": [37.787859, -122.454815]
				},
				{
					"name": "mountain bike 1",
					"filename": "mountain-bike-1.gpx",
					"costing": "bicycle",
					"center": [37.399614, -122.304894]
				},
				{
					"name": "mountain bike 2",
					"filename": "mountain-bike-2.gpx",
					"costing": "bicycle",
					"center": [37.399614, -122.304894]
				},
				{
					"name": "mountain bike 3",
					"filename": "mountain-bike-3",
					"costing": "bicycle",
					"center": [37.399614, -122.304894]
				}
			];
			return gpxTraces;
	},

	model: function(params){
		this.store.unloadAll('data/transitland/operator');
		this.store.unloadAll('data/transitland/stop');
		this.store.unloadAll('data/transitland/route');
		this.store.unloadAll('data/transitland/route_stop_pattern');
		// Get the gpxTrace fixture
		var fixtures = this.fixtures();
		var gpxTrace;
		var mapMatchRequests = null;

		for (var i = 0; i < fixtures.length; i++){
			if (fixtures[i].name === params.trace){
				gpxTrace = fixtures[i];
			}
		}

		if (gpxTrace) {

			mapMatchRequests =  Ember.$.ajax({
				type: "GET",
				url: 'assets/traces/' + gpxTrace.filename,

			}).then(function(response){
				// look into xpath to query xml dom
				

				var s = new XMLSerializer();
				var str = s.serializeToString(response);
				gpxTrace.coordinates = [];
				var gpxObj;
				// 112 & 114 should be rewritten using xpath
				xml2js.parseString(str, function (err, result){
					gpxObj = result.gpx.trk;
				});
				gpxObj[0].trkseg[0].trkpt.map(function(coord){
					gpxTrace.coordinates.push([parseFloat(coord.$.lat),parseFloat(coord.$.lon)]);
				});
				return gpxTrace;
			})

			.then(function(gpxTrace){
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
				mapMatchRequests = Ember.$.ajax({ 
					type:"POST", 
					url:'https://valhalla.mapzen.com/trace_route?api_key=mapzen-jLrDBSP&', 
					data:JSON.stringify(routeJson) 
				});
				return mapMatchRequests;
			})
			.then(function(response){
				var encodedPolyline = response.trip.legs[0].shape;
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
		});
	},

	actions: {
	}
});