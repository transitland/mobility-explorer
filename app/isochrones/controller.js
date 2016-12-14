/* global moment */

import Ember from 'ember';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';


export default Ember.Controller.extend(setTextboxClosed, sharedActions, {
  queryParams: ['onestop_id', 'isochrone_mode', 'pin', 'departure_time'],

  onestop_id: null,
  departure_time: null,
  moment: moment(),
  mousedOver: false,

  actions: {
    updateLeafletBbox(e) {
      var leafletBounds = e.target.getBounds();
      this.set('leafletBbox', leafletBounds.toBBoxString());
    },
    updateMapMoved(e){
      if (this.get('mousedOver') === true){
        this.set('mapMoved', true);
      }
    },
    mouseOver(){
      this.set('mousedOver', true);
    },
    closePopup: function(e){
      e.target.closePopup();
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
      this.set('departure_time', null);
      if (this.get('isochrone_mode') === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
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
