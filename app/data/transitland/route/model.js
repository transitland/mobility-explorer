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
	route_path_opacity: 0.75,
	route_path_weight: 2.5,
	vehicle_type_color: {
		'bus' : '#8dd3c7',
		'rail' : '#b3de69',
		'metro': '#bebada',
		'ferry' : '#fb8072',
		'cablecar' : '#80b1d3',
		'tram' : '#fdb462'
	},
	default_color: "#6ea0a4",
	default_as_geojson_with_outline: (function(){
		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: "#444444",
						weight: 0,
						opacity: 0
					},
					id: this.onestop_id,
					onestop_id: this.get('onestop_id'),
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('default_color'),
						weight: 2.5,
						opacity: 1
					},
				},
			]
		}
	}).property('geometry'),

	mode_as_geojson_with_outline: (function(){
		let lineColor = this.get('vehicle_type_color')[this.get('vehicle_type')];
		let hexValue = lineColor.split("");
		hexValue.shift();
		var hexLetters = {
			a : 10,
			b : 11,
			c : 12,
			d : 13,
			e : 14,
			f : 15, 
		}

		for (var i = 0; i < 6; i++){
			let hexDigit = hexValue[i]
			if (hexDigit >= 0){
				hexValue[i] = Number.parseInt(hexDigit);
			} else {
				hexValue[i] = hexLetters[hexDigit];
			}
		}

		let red = (hexValue[0] * 16) + hexValue[1];
		let green = (hexValue[2] * 16) + hexValue[3];
		let blue = (hexValue[4] * 16) + hexValue[5];
		
		// from turn-by-turn demo:
		var lum = 0.299 * red + 0.587 * green + 0.114 * blue,
    is_light = (lum > 0xbb);

    let borderColor = (is_light ? '#666666' : '#f8f8f8');

		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: borderColor,
						weight: 5,
						opacity: 0
					},
					id: this.onestop_id,
					onestop_id: this.get('onestop_id'),
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('vehicle_type_color')[this.get('vehicle_type')],
						weight: 3,
						opacity: 1
					},
				},
			]
		}
	}).property('geometry'),
	operator_as_geojson_with_outline: (function(){
		let lineColor = this.get('operator_color');
		let hexValue = lineColor.split("");
		hexValue.shift();
		var hexLetters = {
			a : 10,
			b : 11,
			c : 12,
			d : 13,
			e : 14,
			f : 15, 
		}

		for (var i = 0; i < 6; i++){
			let hexDigit = hexValue[i]
			if (hexDigit >= 0){
				hexValue[i] = Number.parseInt(hexDigit);
			} else {
				hexValue[i] = hexLetters[hexDigit];
			}
		}

		let red = (hexValue[0] * 16) + hexValue[1];
		let green = (hexValue[2] * 16) + hexValue[3];
		let blue = (hexValue[4] * 16) + hexValue[5];
		
		// from turn-by-turn demo:
		var lum = 0.299 * red + 0.587 * green + 0.114 * blue,
    is_light = (lum > 0xbb);

    let borderColor = (is_light ? '#666666' : '#f8f8f8');

		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: borderColor,
						weight: 5,
						opacity: 0
					},
					id: this.onestop_id,
					onestop_id: this.get('onestop_id'),
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('operator_color'),
						weight: 3,
						opacity: 1
					},
				},
			]
		}
	}).property('geometry'),
	operator_color: (function(){
		var str = this.get('operated_by_onestop_id');
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
	}).property('operated_by_onestop_id')

});

export default Route;
