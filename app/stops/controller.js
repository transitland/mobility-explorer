/* global L, moment */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';


export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['onestop_id', 'served_by', 'isochrone_mode', 'pin', 'bbox', 'departure_time'],

  departure_time: null,
  onestop_id: null,
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
  stopSelectContent: Ember.computed(function(){
    if (this.media.isMobile){
      return "Click a stop for more information"
    } else {
      return "Hover over a stop for information";
    }
  }),

  stopCoordinates: Ember.computed('onestop_id', function(){
    var stopLocation = this.model.onlyStop.get('geometry.coordinates');
    var lat = stopLocation[0];
    var lng = stopLocation[1];
    var coordinates = [];
    coordinates.push(lng);
    coordinates.push(lat);
    return coordinates;
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