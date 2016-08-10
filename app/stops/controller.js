import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'served_by'],
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	queryIsInactive: false,
	onestop_id: null,
	selectedStop: null,
	served_by: null,
	hoverStop: null,
	place: null,
	pedestrianIsochrone: false,
	bicycleIsochrone: false,
	autoIsochrone: false,
	isochrones: null,
	isochroneMode: null,
	onlyStop: Ember.computed('onestop_id', function(){
		if (this.get('onestop_id') === null) {
			return
		} else {
			var data = this.get('model');
			var onlyStop = data.get('firstObject');
			if (this.get('onestop_id') === null){
				return null
			} else {
				return onlyStop;
			}
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/stop.png',		
		iconSize: (10, 10)
	}),
	highlightedIcon: L.icon({
		iconUrl: 'assets/images/stop2.png',		
		iconSize: (10, 10),
	}),
	actions: {
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
			// this.set('queryIsInactive', false);
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			// this.set('queryIsInactive', true);
		},
		selectStop(stop){
			this.set('selectedStop', null);
			var highlightedIcon = this.get('highlightedIcon');
			stop.set('stop_icon', highlightedIcon);
			this.set('hoverStop', stop);
		},
		unselectStop(stop){
			var icon = this.get('icon');
			stop.set('stop_icon', icon);
			this.set('hoverStop', null);
		},
		setOnestopId(stop) {
			var onestopId = stop.id;
			this.set('selectedStop', stop);
			this.set('onestop_id', onestopId);
			this.set('served_by', null);
			this.set('displayIsochrone', false);
		},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    },
  	setPlace(selected){
  		this.set('place', selected);
  		this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
  	},
  	clearPlace(){
  		this.set('place', null);
  	},
  	showIsochrone(mode){
  		this.set('isochrones', null);


  		if (mode === 'pedestrian'){
  			this.toggleProperty('pedestrianIsochrone');
  		} else {
  			this.set('pedestrianIsochrone', false);
  		}
  		if (mode === 'bicycle'){
  			this.toggleProperty('bicycleIsochrone');
  		} else {
  			this.set('bicycleIsochrone', false);
  		}
  		if (mode === 'auto'){
  			this.toggleProperty('autoIsochrone');
  		} else {
  			this.set('autoIsochrone', false);
  		}

  		if (this.get('isochroneMode') !== mode){
  			this.set('isochroneMode', mode);
				var url = 'https://matrix.mapzen.com/isochrone?api_key=matrix-bHS1xBE&json=';
				var stopLocation = this.get('onlyStop.geometry.coordinates');
				var json = {
					locations: [{"lat":stopLocation[0], "lon":stopLocation[1]}],
					costing: mode,
					contours: [{"time":15},{"time":30},{"time":45},{"time":60}]
				};
				url += escape(JSON.stringify(json));
		    var self = this; 
		    return Ember.$.ajax({ url }).then(function(json){self.set('isochrones', json.features)});
	    } else {
	    	this.set('isochroneMode', null);
	    }
		},
	}	
});