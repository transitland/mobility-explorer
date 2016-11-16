import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';
import setLoading from 'mobility-playground/mixins/set-loading';
import polygon from 'npm:turf-polygon';
import difference from 'npm:turf-difference';


export default Ember.Route.extend(setLoading, {
	queryParams: {
    isochrone_mode: {
      replace: true,
      refreshModel: true,
    },
    pin: {
      replace: true,
      refreshModel: true
    },
    departure_time: {
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
	model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern');

    if (params.isochrone_mode){
	    var self = this;
	    var pinLocation = params.pin;			

	    if (typeof(pinLocation)==="string"){
	      var pinArray = pinLocation.split(',');
	      pinLocation = pinArray;
	    } 

	    var mode = params.isochrone_mode;
	    var url = 'https://matrix.mapzen.com/isochrone?api_key=matrix-bHS1xBE&json=';
	    var json = {
	      locations: [{"lat":pinLocation[0], "lon":pinLocation[1]}],
	      costing: mode,	      
	      denoise: .3,
	      polygons: true,
        generalize: 50,
	      costing_options: {"pedestrian":{"use_ferry":0}},
	      contours: [{"time":15},{"time":30},{"time":45},{"time":60}],
	    };

	    if (json.costing === "multimodal"){
	      json.denoise = 0;
	      // transit_start_end_max_distance default is 2145 or about 1.5 miles for start/end distance:
	      // transit_transfer_max_distance default is 800 or 0.5 miles for transfer distance:
	      json.costing_options = {"pedestrian":{"use_ferry":0,"transit_start_end_max_distance":10000,"transit_transfer_max_distance":10000}};
	    }
	    if (params.departure_time){
	    	json.date_time = {"type": 1, "value": params.departure_time};
	    }

	    url += escape(JSON.stringify(json));
	    return Ember.RSVP.hash({
	      url: url,
	      isochrones: Ember.$.ajax({ url }).then(function(response){
	      	// var unescapedUrl = unescape(this.url);
	      	// var firstHalf = unescapedUrl.split('"costing":"');
	      	// var secondHalf = firstHalf[1].split('","costing_options');
	      	// var mode = secondHalf[0];
	      	// if (mode === "multimodal"){
	       //  	var features = response.features;
	       //  	for (var k = 0; k < features.length; k++) {
	       //  		// console.log(features[k]);
	       //  	}
	      	// }
	        return response;
	      })
	    });
	  } 
    
  },
	actions: {
	}
});


  
