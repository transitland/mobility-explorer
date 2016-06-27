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
	}).property('geometry')
});

export default Stop;
