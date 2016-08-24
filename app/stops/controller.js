import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'served_by', 'isochrone_mode', 'isochrones_mode'],
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	onestop_id: null,
	selectedStop: null,
	served_by: null,
	isochrone_mode: null,
	isochrones_mode: null,
	hoverStop: null,
	place: null, 
	// stop_isochrone: {"features":[{"properties":{"fill-opacity":0.33,"contour":15,"fill":"#50bf40"},"type":"Feature","geometry":{"coordinates":[[[-122.408623,37.798100],[-122.401268,37.794598],[-122.398018,37.793793],[-122.396843,37.792419],[-122.396423,37.785183],[-122.397209,37.779755],[-122.399864,37.777977],[-122.415672,37.777946],[-122.417923,37.781418],[-122.422165,37.785183],[-122.421677,37.787125],[-122.415977,37.792278],[-122.414642,37.794567],[-122.412231,37.796036],[-122.411324,37.797844],[-122.410690,37.798450],[-122.408623,37.798100]]],"type":"Polygon"}}],"type":"FeatureCollection"},
	pedestrianIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'pedestrian');
	}),
	bicycleIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'bicycle');
	}),
	autoIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'auto');
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
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
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
  	setIsochroneMode(mode){
  		if (this.get('isochrone_mode') === mode){
  			this.set('isochrone_mode', null);
  		} else {
  			this.set('isochrone_mode', mode);
  		}
		},
		setIsochronesMode(){
			debugger;
  		if (this.get('isochrones_mode') === null){
  			this.set('isochrones_mode', true);
  		} else {
  			this.set('isochrones_mode', null);
  		}
		}
	}
});