import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['onestop_id', 'isochrone_mode', 'pin'],
	bbox: null,
	leafletBbox: null,
  leafletBounds: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
  isochrone_mode: null,
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
	moment: moment(),
  currentlyLoading: Ember.inject.service(),
	icon: L.icon({
		iconUrl: 'assets/images/marker1.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
  markerUrl: 'assets/images/marker1.png',
  zoom: 12,
  mousedOver: false,

	actions: {
		updateLeafletBbox(e) {
      this.set('zoom', e.target._zoom);
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
      this.set('leafletBounds', leafletBounds)
		},
		updateMapMoved(e){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
    mouseOver(){
      this.set('mousedOver', true);
    },
  	searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&text=${term}`;      
      return Ember.$.ajax({ url }).then(json => json.features);
    },
  	setPlace: function(selected){
			if (selected.geometry){
        var lng = selected.geometry.coordinates[0];
        var lat = selected.geometry.coordinates[1];
        var coordinates = [];
        coordinates.push(lat);
        coordinates.push(lng);
        this.set('pin', coordinates);
      }
  		this.set('place', selected);
  		this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), pin: this.get('pin'), isochrone_mode: null}});
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	},
    dropPin: function(e){
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      var bounds = this.get('leafletBbox');
      this.set('bbox', bounds);
    },
    updatePin: function(e){
      var lat = e.target._latlng.lat;
      var lng = e.target._latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      var bounds = this.get('leafletBbox');
      this.set('bbox', bounds);
    },
    removePin: function(){
      this.set('pin', null);
      this.set('isochrone_mode', null);
    },
    setIsochroneMode: function(mode){
      if (this.get('isochrone_mode') === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    },
    change(date){
			console.log('date: ' + date);
		},
  }
});