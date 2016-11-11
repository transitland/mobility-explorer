import Ember from 'ember';

export default Ember.Component.extend({
	route: null,
	textOptions: {
			// 'index' : 'Learn about multimodal transportation around the world. Search for a place or browse the map, and use the buttons to view transit routes, stops, and operators.',
			'index' : 'There are so many ways to get from A to B! Use Mapzen Mobility Explorer to understand transportation networks around the world. Find a place using the search box or browse the map. Use the buttons below to start exploring.',
			'routes' : '',
			'route-stop-patterns' : '',
			'stops' : '',
			'operators' : '',
			'isochrones' : ''
	},
	text: Ember.computed('route', function(){
		return this.get('textOptions')[this.get('route')]
	}),
	actions:{
		close: function() {
			console.log('component');
			this.sendAction();
		}
	}
	
	
});
