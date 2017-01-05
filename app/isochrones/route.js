import Ember from 'ember';
import setLoading from 'mobility-playground/mixins/set-loading';


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
		},
		include: {
			replace: true,
			// refreshModel: true
		},
		exclude: {
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
			var pinLocation = params.pin;

			if (typeof(pinLocation)==="string"){
				var pinArray = pinLocation.split(',');
				pinLocation = pinArray;
			}

			var mode = params.isochrone_mode;
			var url = 'https://matrix.mapzen.com/isochrone?api_key=mapzen-jLrDBSP&json=';
			var linkUrl = 'https://matrix.mapzen.com/isochrone?json=';
			var json = {
				locations: [{"lat":pinLocation[0], "lon":pinLocation[1]}],
				costing: mode,
				denoise: 0.3,
				polygons: true,
				generalize: 50,
				costing_options: {"pedestrian":{"use_ferry":0}},
				contours: [{"time":15},{"time":30},{"time":45},{"time":60}],
			};

			if (json.costing === "multimodal"){
				json.denoise = 0;
				// transit_start_end_max_distance default is 2145 or about 1.5 miles for start/end distance:
				// transit_transfer_max_distance default is 800 or 0.5 miles for transfer distance:

				if (params.exclude) {
					json.costing_options = {
						"pedestrian":{
							"use_ferry":0,
							"transit_start_end_max_distance":100000,
							"transit_transfer_max_distance":100000
						},
						"transit":{
							"filters":{
								"operators":{
									"ids":[
										params.exclude
									],
									"action":"exclude"
								}
							}
						}
					};
				} else {
					json.costing_options = {
						"pedestrian":{
							"use_ferry":0,
							"transit_start_end_max_distance":100000,
							"transit_transfer_max_distance":100000
						}
					};
				}
			}
			if (params.departure_time){
				json.date_time = {"type": 1, "value": params.departure_time};
			}

			url = encodeURI(url + JSON.stringify(json));
			linkUrl = encodeURI(linkUrl + JSON.stringify(json));

			// exclude - exclude all of the ids listed in the filter
			// include - include only the ids listed in the filter
			// 
			// use bbox to query for all routes (no operator include/exclude)
			// if one operator is included: use operator id to query routes
			// if more than one operator is included: 
			// if one or more operator is excluded: use operator id to filter out routes by that/those operators
			// 
			// if operator is included/excluded:
			// only show routes for the right operators
			// 
			// re-query for isochrones with any include/exclude selection

			// var routesUrl = 'https://transit.land/api/v1/routes?per_page=false&bbox=';
			// var operatorsUrl = 'https://transit.land/api/v1/operators?per_page=false&bbox=';
			// routesUrl += params.bbox;
			// operatorsUrl += params.bbox;

			// add include/exclude query params

			var isochrones = Ember.$.ajax({ url });
      var operators = this.store.query('data/transitland/operator', {bbox: params.bbox});
      var routes = this.store.query('data/transitland/route', {bbox: params.bbox});

			return Ember.RSVP.hash({
				operators: operators,
				routes: routes,
				isochrones: isochrones,
			});
		}

	},
	actions: {
	}
});



