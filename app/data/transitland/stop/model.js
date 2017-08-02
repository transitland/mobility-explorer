import Ember from 'ember';
import DS from 'ember-data';

var Stop = DS.Model.extend({
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	onestop_id: Ember.computed.alias('id'),
	geometry: DS.attr(),
	geometry_centroid: DS.attr(),
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
	html:'<div class="svg-wrapper"><span class="stop-num"></span><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg></div>',
	icon_class: Ember.computed('rsp_stop_pattern_number', function(){
		if (this.get('rsp_stop_pattern_number')){
			return 'svg-stop-rsp';
		} else {
			return 'svg-stop';
		}
	}),
	rsp_stop_pattern_number: null
});

export default Stop;