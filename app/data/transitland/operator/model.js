import Ember from 'ember';
import DS from 'ember-data';

var Operator = DS.Model.extend({
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	name: DS.attr('string'),
	short_name: DS.attr('string'),
	onestop_id: Ember.computed.alias('id'),
	tags: DS.attr(),
	website: DS.attr('string'),
	country: DS.attr('string'),
	state: DS.attr('string'),
	metro: DS.attr('string'),
	timezone: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	geometry: DS.attr(),
	represented_in_feed_onestop_ids: DS.attr(),
	operator_path_opacity: 0.5,
	operator_path_weight: 1.5,
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
		var str = this.get('onestop_id');
		var hash = 0;
		for (var i = 0; i <str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		var hex = ((hash>>24)&0xFF).toString(16) + ((hash>>16)&0xFF).toString(16) + ((hash>>8)&0xFF).toString(16) + (hash&0xFF).toString(16);
		hex += '000000';
		var colorCode = hex.substring(0, 6);
		colorCode.toString();
		colorCode = "#" + colorCode;
		return colorCode;
	}).property('onestop_id')
});

export default Operator;



