import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  // Datastore
  // created_or_updated_in_changeset: DS.belongsTo('changeset', { async: true }),
	onestop_id: Ember.computed.alias('id'),
	name: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	geometry: DS.attr(),
	tags: DS.attr(),
	timezone: DS.attr('string'),
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	operators_serving_stop: DS.attr(),
	routes_serving_stop: DS.attr(),

  // Ember
	rsp_stop_pattern_number: null,
	location: (function(){
		return this.get('geometry')['coordinates'].reverse();
	}).property('geometry'),
	html:'<div class="svg-wrapper"><span class="stop-num"></span><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg></div>',
	icon_class: Ember.computed('rsp_stop_pattern_number', function(){
		if (this.get('rsp_stop_pattern_number')){
			return 'svg-stop-rsp';
		} else {
			return 'svg-stop';
		}
	}),
  
  // Dispatcher
  coordinates: Ember.computed('geometry', function () {
    return this.get('geometry').coordinates.slice().reverse();
  }),
  setCoordinates: function(value) {
    this.set('geometry', {type: 'Point', coordinates: value.map(function(c) { return parseFloat(c.toFixed(5)); } ) });
  },
  entityType: function() {
    return 'stop';
  },
  toChange: function() {
    return {
      onestopId: this.id,
      name: this.get('name'),
      timezone: this.get('timezone'),
      geometry: {
        type: "Point",
        coordinates: this.get('geometry').coordinates
      }
    };
  }
});
