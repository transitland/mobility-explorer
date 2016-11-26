/* global L, moment */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';

export default Ember.Controller.extend(mapBboxController, setTextboxClosed, {
	queryParams: ['onestop_id', 'served_by', 'isochrone_mode', 'pin', 'bbox', 'departure_time'],
  bbox: null,
  departure_time: null,
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
	closeTextbox: Ember.inject.service(),
  textboxIsClosed: Ember.computed('closeTextbox.textboxIsClosed', function(){
    return this.get('closeTextbox').get('textboxIsClosed');
  }),
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
      this.set('pin', null);
			this.set('selectedStop', stop);
			this.set('onestop_id', onestopId);
			this.set('served_by', null);
			this.set('displayIsochrone', false);
			this.set('isochrones_mode', null);
		},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=mapzen-jLrDBSP&sources=wof&text=${term}`;
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
  	},
    change(date){
      var dateString = date.toString();
      var dateArray = dateString.split(" ");
      var monthString = dateArray[1];
      var day = dateArray[2];
      var year = dateArray[3];
      var timeArray = dateArray[4].split(":");
      var hour = timeArray[0];
      var minute = timeArray[1];
      var month = {
        'Jan' : '01',
        'Feb' : '02',
        'Mar' : '03',
        'Apr' : '04',
        'May' : '05',
        'Jun' : '06',
        'Jul' : '07',
        'Aug' : '08',
        'Sep' : '09',
        'Oct' : '10',
        'Nov' : '11',
        'Dec' : '12'
      };
      var newDepartureTime = year + "-" + month[monthString] + "-" + day + "T" + hour + ":" + minute;

      // This is the local date and time at the location.
      // value:
      // the date and time is specified in ISO 8601 format (YYYY-MM-DDThh:mm) in
      // the local time zone of departure or arrival. For example "2016-07-03T08:06"
      // ISO 8601 uses the 24-hour clock system.
      // A single point in time can be represented by concatenating a complete date expression,
      // the letter T as a delimiter, and a valid time expression. For example, "2007-04-05T14:30".

      this.set('departure_time', newDepartureTime);
    },
    resetDepartureTime: function(){
      this.set('moment', moment());
      this.set('departure_time', null);
    }
	}
});
