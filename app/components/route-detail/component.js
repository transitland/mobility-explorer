import Ember from 'ember';

export default Ember.Component.extend({

	routes: Ember.computed('routes', function(){
		var data = this.get('routes');
		var routes = [];
		routes = routes.concat(data.map(function(route){return route.get('name');}));
		return routes;
	})
	

});

