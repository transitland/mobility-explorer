import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'stops_served_by_route', 'operated_by'],
	bbox: null,
	onestop_id: null,
	stops_served_by_route: null,
	operated_by: null,
	// operatedByOnestopId: null,
	selectedRoute: null,
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			// -122.54287719726562%2C37.706911598228466%2C-122.29568481445312%2C37.84259697150785
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
	actions: {
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