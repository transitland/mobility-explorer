import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['onestop_id', 'served_by', 'isochrone_mode', 'pin', 'bbox'],
  bbox: null,
  leafletBbox: null,
  leafletBounds: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
  pin: null,
  onestop_id: null,
	pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==="string"){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
  }),
  place: null,
  icon: L.icon({
		iconUrl: 'assets/images/marker1.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
	markerUrl: 'assets/images/marker1.png',
  zoom: 12,
	selectedStop: null,
	served_by: null,
	isochrone_mode: null,
	isochrones_mode: null,
  currentlyLoading: Ember.inject.service(),
	hoverStop: null,
	moment: moment(),
	mapMoved: false,
	mousedOver: false,
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.mapzen.com">Mapzen</a> | <a href="http://www.transit.land">Transitland</a> | Imagery © <a href="https://carto.com/">CARTO</a>',
	actions: {
		change(date){
		},
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
      this.set('pin', null);
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
    setPlace: function(selected){
      this.set('pin', null);
      var lng = selected.geometry.coordinates[0];
      var lat = selected.geometry.coordinates[1];
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      
      this.set('place', selected);
      this.set('pin', coordinates);
      this.transitionToRoute('index', {queryParams: {pin: this.get('pin'), bbox: null}});
    },
  	clearPlace(){
  		this.set('place', null);
  	},
  	removePin: function(){
      this.set('pin', null);
    },
    dropPin: function(e){
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
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
  	}
	}
});