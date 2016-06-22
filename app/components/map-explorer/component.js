import Ember from 'ember';

export default Ember.Component.extend({
	lat: 37.7749,
	lng: -122.4194,
	zoom: 12,
	bbox: null,
	resetButton: false,
	testLocation: [37.7749, -122.4194],
	testLocationTwo: [37.7900, -122.4194],
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',
		iconSize: (20, 20)
	}),
	actions: {
		updatebbox(e) {
			var newbox = e.target.getBounds();
			this.set('bbox', newbox.toBBoxString());
			this.get('getbbox')(newbox);
		}
	}
});