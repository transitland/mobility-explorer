import Ember from 'ember';
import setLoading from 'mobility-playground/mixins/set-loading';
import xml2js from 'npm:xml2js';

export default Ember.Route.extend(setLoading, {
	queryParams: {
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
	model: function(params){
		this.store.unloadAll('data/transitland/operator');
		this.store.unloadAll('data/transitland/stop');
		this.store.unloadAll('data/transitland/route');
		this.store.unloadAll('data/transitland/route_stop_pattern');

		var trace;
			
		var gpx = '<?xml version="1.0" encoding="UTF-8"?><gpx creator="strava.com iPhone" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"><metadata><time>2017-02-12T18:16:26Z</time></metadata><trk><name>Morning Run</name><trkseg><trkpt lat="37.7499690" lon="-122.5083000"><ele>8.1</ele><time>2017-02-12T18:16:26Z</time></trkpt><trkpt lat="37.7499620" lon="-122.5083530"><ele>8.2</ele><time>2017-02-12T18:16:28Z</time></trkpt><trkpt lat="37.7499610" lon="-122.5083540"><ele>8.2</ele><time>2017-02-12T18:16:30Z</time></trkpt></trkseg></trk></gpx>';
  	xml2js.parseString(gpx, function (err, result){
	     trace = result.gpx.trk;
	   });
  	console.log(trace);

		return Ember.RSVP.hash({
			trace: trace
		});

	},
	actions: {
	}
});



