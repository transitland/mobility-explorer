import Ember from 'ember';

export default Ember.Component.extend({
	route: null,
	textOptions: {
			'index' : 'Learn about multimodal transportation around the world. Search for a place or browse the map, and use the buttons to view transit routes, stops, and operators.',
			'routes' : '',
			'route-stop-patterns' : '',
			'stops' : '',
			'operators' : '',
			'isochrones' : ''
	},
	text: Ember.computed('route', function(){
		return this.get('textOptions')[this.get('route')]
	})
});
