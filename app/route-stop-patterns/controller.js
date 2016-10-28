import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['traversed_by'],
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	traversed_by: null,
	onestop_id: null,
	serves: null,
	bbox: null,
	currentlyLoading: Ember.inject.service(),
	displayStops: false,
	displayRspStops: false,
	selectedRsp: null,
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			var defaultBoundsArray = [];
			defaultBoundsArray.push([37.706911598228466, -122.54287719726562]);
			defaultBoundsArray.push([37.84259697150785, -122.29568481445312]);
			return defaultBoundsArray;
		} else {
			var coordinateArray = [];
			var bboxString = this.get('bbox');
			var tempArray = [];
			var boundsArray = [];

			coordinateArray = bboxString.split(',');

			for (var i = 0; i < coordinateArray.length; i++){
				tempArray.push(parseFloat(coordinateArray[i]));
			}
		
			var arrayOne = [];
			var arrayTwo = [];
			arrayOne.push(tempArray[1]);
			arrayOne.push(tempArray[0]);
			arrayTwo.push(tempArray[3]);
			arrayTwo.push(tempArray[2]);
			boundsArray.push(arrayOne);
			boundsArray.push(arrayTwo);
			return boundsArray;
		}
	}),

	mapMoved: false,
	mousedOver: false,
	actions: {
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);
		},
		onEachFeature(feature, layer){
			layer.setStyle(feature.properties);	
		},
		setOnestopId(route) {
			var onestopId = route.id;
			this.set('onestop_id', onestopId);
			this.set('selectedRoute', route);
			this.set('serves', null);
			this.set('operated_by', null);
		},
		setPlace: function(selected){
			this.set('place', selected);
			this.set('bbox', selected.bbox);
			this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
		},
		clearPlace(){
			this.set('place', null);
		},
		searchRepo(term) {
			if (Ember.isBlank(term)) { return []; }
			const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
			return Ember.$.ajax({ url }).then(json => json.features);
		},
		displayStops: function(){
			this.toggleProperty('displayStops');
		},
		setRsp: function(rsp){
			if (this.get('selectedRsp')!== null){
				var stops = this.get('selectedRsp').get('stop_pattern')
				var stopsLength = stops.length
				for (var i = 0; i < stopsLength; i++){ 
					var stopId = stops[i]; 
					this.store.peekRecord('data/transitland/stop',stopId).set('rsp_stop_pattern_number', null)
				}
			}
			if (this.get('selectedRsp')!== null && this.get('selectedRsp').get('id') === rsp.get('id')){
				this.set('selectedRsp', null);
				rsp.set('is_selected', false);
				rsp.set('default_opacity', 0);
			} else if (this.get('selectedRsp')!== null){
				var stops = this.get('selectedRsp').get('stop_pattern')
				var stopsLength = stops.length
				for (var i = 0; i < stopsLength; i++){ 
					var stopId = stops[i]; 
					this.store.peekRecord('data/transitland/stop',stopId).set('rsp_stop_pattern_number', null)
				}
				this.get('selectedRsp').set('default_opacity', 0);
				
				rsp.set('default_opacity', 1);
				this.get('selectedRsp').set('is_selected', false);
				rsp.set('is_selected', true);
				this.set('selectedRsp', rsp);
				stops = this.selectedRsp.get('stop_pattern')
				stopsLength = stops.length
				for (var i = 0; i < stopsLength; i++){ 
					var stopId = stops[i]; 
					this.store.peekRecord('data/transitland/stop',stopId).set('rsp_stop_pattern_number', i+1)
				}
			}
			else {
				this.set('selectedRsp', rsp);
				rsp.set('is_selected', true);
				rsp.set('default_opacity', 1);
				var stops = this.selectedRsp.get('stop_pattern')
				var stopsLength = stops.length
				for (var i = 0; i < stopsLength; i++){ 
					var stopId = stops[i]; 
					this.store.peekRecord('data/transitland/stop',stopId).set('rsp_stop_pattern_number', i+1)
				}
			}
		}
	}
	
});