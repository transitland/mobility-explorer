import Ember from 'ember';
import DS from 'ember-data';

var Route = DS.Model.extend({
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	onestop_id: Ember.computed.alias('id'),
	name: DS.attr('string'),
	vehicle_type: DS.attr('string'),
	short_name: DS.attr('string'),
	geometry: DS.attr(),
	color: DS.attr('string'),
	tags: DS.attr(),
	operated_by_onestop_id: DS.attr('string'),
	operated_by_name: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	route_stop_patterns_by_onestop_id: DS.attr(),
	
	location: (function(){
		var coordinates = this.get('geometry')['coordinates'][0];
		var coordinatesLength = coordinates.length;
		var reversedCoordArray = [];
		for (var i = 0; i < coordinatesLength; i++){
			var tempCoord = null;
			var lat = this.get('geometry')['coordinates'][0][i][0];
			var lon = this.get('geometry')['coordinates'][0][i][1];
			tempCoord = lat;
			lat = lon;
			lon = tempCoord;
			var coordArray = [];
			coordArray.push(lat);
			coordArray.push(lon);
			reversedCoordArray.push(coordArray);
		}
		return reversedCoordArray;
	}).property('geometry'),

	operator_color: (function(){
		// if (this.get('operated_by_onestop_id') === 'o-9q8y-sfmta'){
		// 	return 'red';
		// } else {
		// 	return 'yellow';
		// }
		
		// write funtion that creates a hash


	}).property('operated_by_onestop_id')
});

export default Route;
