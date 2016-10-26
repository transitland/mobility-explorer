import Ember from 'ember';
import DS from 'ember-data';

var Stop = DS.Model.extend({
	// routes: DS.hasMany('data/transitland/route', {async: true}),

	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	onestop_id: Ember.computed.alias('id'),
	geometry: DS.attr(),
	name: DS.attr('string'),
	tags: DS.attr(),
	timezone: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	operators_serving_stop: DS.attr(),
	routes_serving_stop: DS.attr(),
	location: (function(){
		return this.get('geometry')['coordinates'].reverse();
	}).property('geometry'),
	// stop_icon: L.icon({
	// 	iconUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22180%22%20viewBox%3D%220%200%20180%20180%22%3E%3Cpath%20d%3D%22M90%2014c-42.053%200-76%2033.947-76%2076%200%2042.054%2033.947%2076%2076%2076%2042.054%200%2076-33.946%2076-76%200-42.053-33.946-76-76-76z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M90%2022.365c37.29%200%2067.635%2030.346%2067.635%2067.635%200%2037.29-30.345%2067.635-67.635%2067.635S22.365%20127.29%2022.365%2090c0-37.29%2030.345-67.635%2067.635-67.635%22%2F%3E%3C%2Fsvg%3E',
	// 	iconSize: (10, 10),
	// })
	// stop_icon: L.divIcon({
	// 	html: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
 //     width="180px" height="180px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"><path id="outer-circle" d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg>'
	// 	iconSize: (10, 10),
	// })
	// stop_icon: L.divIcon({
	html:'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="180px" height="180px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path id="outer-circle" d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg>',

		// iconSize: (20, 20),
	// })
});

export default Stop;