import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['bbox'],
	bbox: null,
	lat: 37.7749,
	lng: -122.4194,
	zoom: 12,
	actions: {
		
	}
});