import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bBox'],
	bBox: null,
	lat: 37.7749,
	lng: -122.4194,
	zoom: 12,
	icon: L.icon({
		iconUrl: 'assets/images/stop.png',		
		iconSize: (10, 10)
	}),
	actions: {
		updateBbox(e) {
			var newBox = e.target.getBounds();
			this.set('bBox', newBox.toBBoxString());
		}
	}	
});

