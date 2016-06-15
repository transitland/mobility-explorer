import Ember from 'ember';
import DS from 'ember-data';
// import { hasMany } from 'ember-data/relationships';


var Feed = DS.Model.extend({
  onestop_id: Ember.computed.alias('id'),
  operators: DS.hasMany('data/transitland/operator', { async: true }),
  url: DS.attr('string'),
  feed_format: DS.attr('string'),
  license_name: DS.attr('string'),
  license_url: DS.attr('string'),
  license_use_without_attribution: DS.attr('string'),
  license_create_derived_product: DS.attr('string'),
  license_redistribute: DS.attr('string'),
  license_attribution_text: DS.attr('string'),
  last_sha1: DS.attr('string'),
  last_fetched_at: DS.attr('string'),
  last_imported_at: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  operators_in_feed: DS.attr(),
  geometry: DS.attr(),
  tags: DS.attr(),
  import_level_of_active_feed_version: DS.attr()
});


export default Feed;
