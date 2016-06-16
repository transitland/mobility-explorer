import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

	// params: bbox

	this.route('routes', function(){
		// toggles for route line render style:
		this.route('by-mode');
		this.route('by-operator');
		this.route('by-frequency');
		this.route('bike-access');
		this.route('wheelchair-access');
		// when a single route is selected:
		this.route('route', { path: "/:route-id" });
		// info for specific route:
		// - route name
		// - route long name
		// - operated by (link to operator model)
		// - vehicle type
		// - stops along route (link to stop model)
		// - onestop id
		// links:
		// - to route JSON
	});

	this.route('stops', function(){
		// toggles for stop point render style:
		this.route('by-frequency');
		this.route('walkshed');
		this.route('transitshed');
		// when a single stop is selected:
		this.route('stop', { path: "/:stop-id" });
		// info for specific stop:
		// - stop name
		// - operators serving stop
		// - routes serving stops
		// - onestop id
		// links:
		// - to stop JSON
	});

	this.route('operators', function(){
		this.route('service-areas');
		// when a single stop is selected:
		this.route('operator', { path: "/:operator-id" });
		// - info for specific operator:
		// - name
		// - short name
		// - onestop id
		// links:
		// - to operator JSON
		// - to Feed Registry operator detail page
	});

	this.route('error', { path: "*path" });

});

export default Router;
