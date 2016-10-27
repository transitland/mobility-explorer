import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['onestop_id', 'serves', 'operated_by', 'vehicle_type', 'style_routes_by', 'bbox'],
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	currentlyLoading: Ember.inject.service(),
	queryIsInactive: false,
	onestop_id: null,
	serves: null,
	bbox: null,
	operated_by: null,
	vehicle_type: null,
	style_routes_by: null,
	selectedRoute: null,
	place: null,
	placeholderMessageRoutes: Ember.computed('leafletBbox', function(){
		var total = this.model.routes.get('meta.total');
		if (total > 1){
			return  total + " routes";
		} else if (total === 1) {
			return total + " route"
		}
	}),
	placeholderMessageOperators: Ember.computed('leafletBbox', function(){
		var total = this.get('routeOperators').length;
		if (total > 1){
			return  total + " operators";
		} else if (total === 1) {
			return total + " operator"
		}
	}),
	placeholderMessageModes: Ember.computed('leafletBbox', function(){
		var total = this.get('routeModes').length;
		if (total > 1){
			return  total + " modes";
		} else if (total === 1) {
			return total + " mode"
		}
	}),
	routeOperators: Ember.computed('leafletBbox', function(){
		var routesLength = this.get('routes').length;
		var allRoutes = this.get('routes');
		var checkList = [];
		var uniqueOperators = [];
		for (var i = 0; i < routesLength; i++){
			let operatorName = allRoutes[i].get('operated_by_name');
			let operatorOnestopid = allRoutes[i].get('operated_by_onestop_id');
			let operatorColor = allRoutes[i].get('operator_color');
			if (checkList.indexOf(operatorName) === -1){
				checkList.push(operatorName);
				var uniqueOperator = {};
				uniqueOperator["name"] = operatorName;
				uniqueOperator["onestopId"] = operatorOnestopid;
				uniqueOperator["style"] = "background-color:" + operatorColor;
				uniqueOperators.push(uniqueOperator);
			}
		}
		return uniqueOperators;
	}),
	routeModes: Ember.computed('leafletBbox', function(){
		var routesLength = this.get('routes').length;
		var allRoutes = this.get('routes');
		var checkList = [];
		var uniqueModes = [];
		var modeColors = {
			"bus": "#8dd3c7",
			"rail": "#b3de69",
			"metro": "#bebada",
			"tram": "#fdb462",
			"ferry": "#fb8072",
			"cablecar": "#80b1d3"
		};
		for (var i = 0; i < routesLength; i++){
			let modeName = allRoutes[i].get('vehicle_type');
			var modeColor = null;
			if (modeName in modeColors){
				modeColor = modeColors[modeName];
			} else {
				modeColor = "grey"
			}
			if (checkList.indexOf(modeName) === -1){
				checkList.push(modeName);
				var uniqueMode = {};
				uniqueMode["name"] = modeName;
				uniqueMode["style"] = "background-color:" + modeColor;
				uniqueModes.push(uniqueMode);
			}
		}
		return uniqueModes;
	}),
	route_stop_patterns_by_onestop_id: null,
	displayStops: false,
	stopLocation: Ember.computed(function(){
		var stops = this.model.stops.features;
		var coordinates = stops.get('geometry')['coordinates'];
		var tempCoord = null;
		var lat = coordinates[0];
		var lon = coordinates[1];
		tempCoord = lat;
		var coordArray = [];
		coordArray.push(lon);
		coordArray.push(lat);
		return coordArray;
	}),
	onlyRoute: Ember.computed('onestop_id', function(){
		var data = this.get('routes');
		var onlyRoute = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null
		} else {
			return onlyRoute;
		}
	}),
	hoverId: null,
	unstyledColor: "#6ea0a4",
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			var defaultBoundsArray = [];
			defaultBoundsArray.push([37.706911598228466, -122.54287719726562]);
			defaultBoundsArray.push([37.84259697150785, -122.29568481445312]);
			return defaultBoundsArray;
		} else {
			var coordinateArray = [];
			var bboxString = this.get('bbox');
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
			return boundsArray;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20)
	}),
	routes: Ember.computed('model', function(){
		var data = this.get('model.routes');
		var routes = [];
		routes = routes.concat(data.map(function(route){return route;}));
		return routes;
	}),
	route_stop_patterns_by_onestop_ids: Ember.computed ('model', function(){
		return this.get('model').get('firstObject').get('route_stop_patterns_by_onestop_id');
	}),
	mapMoved: false,
	mousedOver: false,
	actions: {
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);	
		},
		setRouteStyle(style){
			if (this.get('style_routes_by') === style){
  			this.set('style_routes_by', null);
  		} else {
  			this.set('style_routes_by', style);
  		}
		},
		setRoute(route){
			var onestop_id = route.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedRoute', route);
		},
		clearRoute(){
  		this.set('onestop_id', null);
			this.set('selectedRoute', null);
  	},
  	setOperator(operator){
  		this.set('operated_by', operator.onestopId);
		},
		clearOperator(){
			this.set('operated_by', null);
		},
		setMode(mode){
  		this.set('vehicle_type', mode.name);
		},
		clearMode(){
			this.set('vehicle_type', null);
		},
		selectRoute(e){
			e.target.bringToFront();
			e.target.getLayers()[1].setStyle({
				"color": "white",
				"opacity": 1,
				// "weight": 2.5,
			});
			e.target.getLayers()[0].setStyle({
				"color": "#666666",
				"opacity": 1,
				"weight": 5,
			});
			this.set('hoverId', (e.target.getLayers()[0].feature.onestop_id));	
		},
		onEachFeature(feature, layer){
			layer.setStyle(feature.properties);
			layer.originalStyle = feature.properties;

			if (this.get('onestop_id')){
				layer.eachLayer(function(layer){layer.setStyle({"opacity":1})})
			}
		},
		unselectRoute(e){
			e.target.eachLayer(function(layer){
				layer.setStyle(layer.originalStyle);
			});
			this.set('hoverId', null);
		},
		setOnestopId: function(route) {
			var onestopId = route.id;
			this.set('onestop_id', onestopId);
			this.set('selectedRoute', route);
			this.set('serves', null);
			this.set('operated_by', null);
		},
		setPlace: function(selected){
  		this.set('place', selected);
  		this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	},
		searchRepo: function(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    },
    displayStops: function(){
  		if (this.get('displayStops') === false){
  			if (this.model.stops.features.get('firstObject').icon){
    			this.set('displayStops', true);
  			} else {
					var stops = this.model.stops.features;
					for (var i = 0; i < stops.length; i++){
						var tempCoord = null;
						var lat = stops[i].geometry.coordinates[0];
						var lon = stops[i].geometry.coordinates[1];
						tempCoord = lat;
						var coords = stops[i].geometry.coordinates
						var coordArray = [];
						coordArray.push(lon);
						coordArray.push(lat);
						this.model.stops.features[i].geometry.coordinates = coordArray;
						this.model.stops.features[i].icon = L.divIcon({
							html:'<div class="svg-wrapper"><span class="stop-num"></span><svg class="svg-stop" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg></div>',
							className:'svg-stop',
						});
					}
	    		this.set('displayStops', true);
	    	}
			} else {
    		this.set('displayStops', false);
    	}
    },
    displaySharedStop: function(){
			var stops = this.model.stopServedByRoutes.features;
			for (var i = 0; i < stops.length; i++){
				var tempCoord = null;
				var lat = stops[i].geometry.coordinates[0];
				var lon = stops[i].geometry.coordinates[1];
				tempCoord = lat;
				var coords = stops[i].geometry.coordinates
				var coordArray = [];
				coordArray.push(lon);
				coordArray.push(lat);
				this.model.stopServedByRoutes.features[i].geometry.coordinates = coordArray;
				this.model.stopServedByRoutes.features[i].icon = L.icon({
					iconUrl: 'assets/images/stop.png',		
					iconSize: (10, 10),
				});
			}
  		return true;
    },
    setRouteStopPattern: function(selected){
    	this.set('routeStopPattern', selected);
    	this.transitionToRoute('route-stop-pattern', {queryParams: {bbox: this.get('bbox'), traversed_by: this.get('onestop_id')}});
    },
    clearRouteStopPattern: function(){
    	this.set('routeStopPattern', null);
    }
  }
	
});