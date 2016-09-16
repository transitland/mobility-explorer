import Ember from 'ember';
import DS from 'ember-data';

var Route_stop_patterns = DS.Model.extend({
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr(),
	imported_from_feed_version_sha1s: DS.attr(),
	created_or_updated_in_changeset_id: 2259,
	onestop_id: "r-9q8zn-45-443d34-6f8b31",
	route_onestop_id: Ember.computed.alias('id'),
	stop_pattern: DS.attr(),
	stop_distances: DS.attr(),
	geometry: DS.attr(),
	color: DS.attr('string'),
	is_generated: DS.attr('boolean'),
	is_modified: DS.attr('boolean'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	trips: DS.attr(),
	tags: DS.attr(),
});

export default Route_stop_patterns;


