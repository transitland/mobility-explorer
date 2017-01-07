/* global moment */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';


export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['onestop_id', 'isochrone_mode', 'pin', 'departure_time', 'include_operators', 'exclude_operators', 'include_routes', 'exclude_routes'],

  onestop_id: null,
  departure_time: null,
  isochrone_mode: null,
  moment: moment(),
  mousedOver: false,
  include_operators: [],
  exclude_operators: [],
  include_routes: [],
  exclude_routes: [],

  // this iterates through the arrays for the included and excluded query params, and sets the included or excluded 
  // model attributes for the entities with listed onestopIDs
  markIncludedExcluded: Ember.computed('include_operators', function(){
    if (this.get('exclude_operators').length > 0) {
      for (var i = 0; i < this.get('exclude_operators').length; i++){
        var excludeOperator = this.get('exclude_operators')[i];
        this.store.peekRecord('data/transitland/operator', excludeOperator).set('exclude', true);
      }
    }

    if (this.get('include_operators').length > 0) {
      for (var j = 0; j < this.get('include_operators').length; j++){
        var includeOperator = this.get('include_operators')[j];
        this.store.peekRecord('data/transitland/operator', includeOperator).set('include', true);
      }
    }

    if (this.get('exclude_routes').length > 0) {
      for (var k = 0; k < this.get('exclude_routes').length; k++){
        var excludeRoute = this.get('exclude_routes')[k];
        this.store.peekRecord('data/transitland/route', excludeRoute).set('exclude', true);
      }
    }

    if (this.get('include_routes').length > 0) {
      for (var l = 0; l < this.get('include_routes').length; l++){
        var includeRoute = this.get('include_routes')[l];
        this.store.peekRecord('data/transitland/route', includeRoute).set('include', true);
      }
    }
    return true;
  }),

  // operatorIsIncluded: Ember.computed('inlude_operators', function(){
  //   console.log('operatorIsIncluded');
  //   return true;
  // }),

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
      if (mode === "multimodal"){
        // debugger;
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
    },
    includeOperator: function(operator){
      if (this.get('include_operators').includes(operator.id)){
        this.get('include_operators').removeObject(operator.id);
        this.store.peekRecord('data/transitland/operator', operator.id).set('include', false);
      } else {
        this.get('include_operators').pushObject(operator.id);
        this.store.peekRecord('data/transitland/operator', operator.id).set('include', true);
        if (this.get('exclude_operators').includes(operator.id)){
          this.get('exclude_operators').removeObject(operator.id);
          this.store.peekRecord('data/transitland/operator', operator.id).set('exclude', false);
        }
      }
      this.get('exclude_operators').clear();
    },
    excludeOperator: function(operator){
      if (this.get('exclude_operators').includes(operator.id)){
        this.store.peekRecord('data/transitland/operator', operator.id).set('exclude', false);
        this.get('exclude_operators').removeObject(operator.id);
      } else {
        this.store.peekRecord('data/transitland/operator', operator.id).set('exclude', true);
        this.get('exclude_operators').pushObject(operator.id);
        if (this.get('include_operators').includes(operator.id)){
          this.store.peekRecord('data/transitland/operator', operator.id).set('include', false);
          this.get('include_operators').removeObject(operator.id);
        }
      }
      this.get('include_operators').clear();
    },
    includeRoute: function(route){
      if (this.get('include_routes').includes(route.id)){
        this.store.peekRecord('data/transitland/route', route.id).set('include', false);
        this.get('include_routes').removeObject(route.id);
      } else {
        this.store.peekRecord('data/transitland/route', route.id).set('include', true);
        this.get('include_routes').pushObject(route.id);
        if (this.get('exclude_routes').includes(route.id)){
          this.store.peekRecord('data/transitland/route', route.id).set('exclude', false);
          this.get('exclude_routes').removeObject(route.id);
        }
      }
      this.get('exclude_routes').clear();
    },
    excludeRoute: function(route){
      if (this.get('exclude_routes').includes(route.id)){
        this.get('exclude_routes').removeObject(route.id);
        this.store.peekRecord('data/transitland/route', route.id).set('exclude', false);
      } else {
        this.get('exclude_routes').pushObject(route.id);
        this.store.peekRecord('data/transitland/route', route.id).set('exclude', true);
        if (this.get('include_routes').includes(route.id)){
          this.get('include_routes').removeObject(route.id);
          this.store.peekRecord('data/transitland/route', route.id).set('include', false);
        }
      }
      this.get('include_routes').clear();
    }
  }
});