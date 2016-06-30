import Ember from 'ember';

export default Ember.Component.extend({

	routes: Ember.computed('routes', function(){
		var data = this.get('routes');

		var routes = [];
		routes = routes.concat(data.map(function(route){return route.get('name');}));
		// return ['Stefan', 'Miguel', 'Tomster', 'Pluto']
		return routes;
	})
	

});

// {"routes":[{"identifiers":["gtfs://f-9q9-caltrain/r/SHUTTLE"],"imported_from_feed_onestop_ids":["f-9q9-caltrain"],"imported_from_feed_version_sha1s":["22d46513a229c9a10c4d04c8d34bb89d5e422147","36ba71b654ba6ed1e4866822832c11942c4761e5"],"created_or_updated_in_changeset_id":909,"onestop_id":"r-9q9k6-shuttle","name":"SHUTTLE","vehicle_type":"bus","geometry":{"type":"MultiLineString","coordinates":[[[-121.88275,37.31039],[-121.90193,37.32919]],[[-121.90193,37.32919],[-121.88275,37.31039]]]},"color":null,"tags":{"route_url":null,"route_desc":null,"route_long_name":"SHUTTLE","route_text_color":null},"operated_by_onestop_id":"o-9q9-caltrain","operated_by_name":"Caltrain","created_at":"2016-02-06T20:05:59.155Z","updated_at":"2016-04-11T23:45:06.134Z","route_stop_patterns_by_onestop_id":["r-9q9k6-shuttle-75b458-306909","r-9q9k6-shuttle-aa7144-bf52b6"]},{"identifiers":["gtfs://f-9q9-caltrain/r/LOCAL"],"imported_from_feed_onestop_ids":["f-9q9-caltrain"],