import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['onestop_id', 'served_by', 'isochrone_mode', 'isochrones_mode', 'bus_only'],
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	onestop_id: null,
	selectedStop: null,
	served_by: null,
	isochrone_mode: null,
	isochrones_mode: null,
  currentlyLoading: Ember.inject.service(),
	hoverStop: null,
	place: null,
	bus_only: null,
	pedestrianIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'pedestrian');
	}),
	bicycleIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'bicycle');
	}),
	multimodalIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'multimodal');
	}),
	autoIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'auto');
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
		selectStop(stop){
			this.set('selectedStop', null);
			this.set('hoverStop', stop);
		},
		unselectStop(stop){
			this.set('hoverStop', null);
		},
		setOnestopId(stop) {
			var onestopId = stop.id;
			this.set('selectedStop', stop);
			this.set('onestop_id', onestopId);
			this.set('served_by', null);
			this.set('displayIsochrone', false);
			this.set('isochrones_mode', null);
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
  	setIsochroneMode(mode){
  		if (this.get('isochrone_mode') === mode){
  			this.set('isochrone_mode', null);
  		} else {
  			this.set('isochrone_mode', mode);
  		}
		},
		setIsochronesMode(){
  		if (this.get('isochrones_mode') === null){
  			this.set('isochrones_mode', true);
  		} else {
  			this.set('isochrones_mode', null);
  		}
  	},
		setBusOnly(){
  		if (this.get('bus_only') === true){
  			this.set('bus_only', null);
  		} else {
  			this.set('bus_only', true);

  		}
		}
	}
});