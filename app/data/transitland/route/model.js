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
	default_color: "#6ea0a4",
	
	default_as_geojson_with_outline: (function(){
		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: "black",
						weight: 4,
						opacity: 1
					},
					id: this.onestop_id
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('default_color'),
						weight: 2,
						opacity: 1

					},
				},
			]
		}
	}).property('geometry'),
	mode_as_geojson_with_outline: (function(){
		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: "black",
						weight: 4,
						opacity: 1
					},
					id: this.onestop_id
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('vehicle_type_color'),
						weight: 2,
						opacity: 1

					},
				},
			]
		}
	}).property('geometry'),
	operator_as_geojson_with_outline: (function(){
		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: "black",
						weight: 4,
						opacity: 1
					},
					id: this.onestop_id
				},
				{
					type: "Feature",
					geometry: this.get('geometry'),
					properties: {
						color: this.get('operator_color'),
						weight: 2,
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
	}).property('operated_by_onestop_id'),
	vehicle_type_color: (function(){
		if (this.get('vehicle_type') ==='bus') {
			return 'red';
		} else if (this.get('vehicle_type') ==='rail') {
			return 'blue';
		} else if (this.get('vehicle_type') ==='metro') {
			return 'green';
		} else if (this.get('vehicle_type') ==='ferry') {
			return 'purple';
		} else if (this.get('vehicle_type') ==='cablecar') {
			return 'orange';
		} else if (this.get('vehicle_type') ==='tram') {
			return 'aqua';
		} else {
			return 'grey';
		}
	}).property('vehicle_type')

});

export default Route;
