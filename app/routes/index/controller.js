import Ember from 'ember';

export default Ember.Controller.extend({
	bbox: null,
	selectedRoute: null,
	routeStyle: null,
	routeColor: Ember.computed('routeStyle', function(){
		if (this.get('routeStyle') === 'mode'){
			if (this.get('route.vehicle_type') === 'bus'){
				return 'green';
			} else if (this.get('route.vehicle_type') === 'train'){
				return 'purple';
			} else {
				return 'orange';
			}
		} else if (this.get('routeStyle') === 'operator'){
			return 'blue';
		}
	}),
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
	routes: Ember.computed(function(){
		var data = this.get('model');
		var routes = [];
		routes = routes.concat(data.map(function(route){return route;}));
		return routes;
	}),
	routeStyleIsMode: false,
	routeStyleIsOperator: false,
	actions: {
		styleRoutesMode(){
			this.set('routeStyleIsMode', true);
			this.set('routeStyleIsOperator', false);
		},
		styleRoutesOperator(){
			this.set('routeStyleIsMode', false);
			this.set('routeStyleIsOperator', true);
		},
		setRoute(route){
			var onestop_id = route.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedRoute', route);
		},
		setbbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
      let zoom = e.target.getZoom();
      this.set('bounds', this.get('bbox'));
      this.set('lat', center.lat);
      this.set('lng', center.lng);
      this.set('zoom', zoom);
		},
		updatebbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
			let zoom = e.target.getZoom();
			this.set('bounds', this.get('bbox'));
			this.set('lat', center.lat);
			this.set('lng', center.lng);
			this.set('zoom', zoom);
		},
		setOnestopId(route) {
			var onestopId = route.id;
			this.set('onestop_id', onestopId);
			this.set('selectedRoute', route);
			var operatorOnestopId = route.operated_by_onestop_id;
			this.set('operated_by_onestop_id', operatorOnestopId);
		}
  }
	
});