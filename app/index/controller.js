import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import polygon from 'npm:turf-polygon';
import difference from 'npm:turf-difference';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox','pin'],
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	place: null,
  pin: null,
  pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==="string"){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
  }),
  currentlyLoading: Ember.inject.service(),
	icon: L.icon({
		iconUrl: 'assets/images/marker1.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
  markerUrl: 'assets/images/marker1.png',
  mapCenter: [37.778008, -122.431272],
  center: Ember.computed('pin', function(){
    if (this.get('pin')){
      return this.get('pinLocation');
    } else {
      return this.get('mapCenter');
    }
  }),
  zoom: 12,
  isochrone_mode: null,
  isochrones: null,

	actions: {
		updatebbox(e) {
			var newbox = e.target.getBounds();
			this.set('bbox', newbox.toBBoxString());
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
        this.set('mapCenter', coordinates); 
        this.set('pin', coordinates);
      }
  		this.set('place', selected);
      
      var coordinateArray = [];
      var bboxString = this.get('bbox').toString();
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
      this.set('leafletBbox', boundsArray);
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	},
    removePin: function(){
      this.set('pin', null);
    },
    dropPin: function(e){
      console.log(e.latlng);
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('mapCenter', coordinates); 
      this.set('pin', coordinates);
    },
    setIsochroneMode: function(mode){
      if (this.get('isochrone_mode') === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }

      var pinLocation = this.get('pinLocation');
      var url = 'https://matrix.mapzen.com/isochrone?api_key=matrix-bHS1xBE&json=';
      var mode = this.get('isochrone_mode');
      var json = {
        locations: [{"lat":pinLocation[0], "lon":pinLocation[1]}],
        costing: mode,
        costing_options: {"pedestrian":{"use_ferry":0}},
        contours: [{"time":15},{"time":30},{"time":45},{"time":60}],
      };
      var isochrones = null;
      
      if (json.costing === "multimodal"){
        json.denoise = .1;
      }

      url += escape(JSON.stringify(json));

      var isochronesObject = null;
      
      var isochrones = Ember.$.ajax({ url }).then(function(response){
        var features = response.features;
        for(var k = 0; k < features.length; k++) {
          //find the next set of contours
          var i = k + 1;
          while(i < features.length && features[i].properties.contour == features[k].properties.contour)
            i++;
          if(i >= features.length)
          break;
          //cut this one by all of these smaller contours
          var outer = polygon(features[k].geometry.coordinates);
          var contour = features[i].properties.contour;
          while(i < features.length && contour == features[i].properties.contour) {
            var inner = polygon(features[i].geometry.coordinates);
            outer = difference(outer, inner);
            i++;
          }
          //keep it
          features[k].geometry = outer.geometry;

        }     

        this.isochronesObject = features;
        // debugger;

      });
        // debugger;

      this.set('isochrones', isochrones);
        // debugger;

    }
  }
});