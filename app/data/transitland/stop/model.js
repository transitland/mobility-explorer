import Ember from 'ember';
import DS from 'ember-data';

var Stop = DS.Model.extend({
	identifiers: DS.attr(),
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
