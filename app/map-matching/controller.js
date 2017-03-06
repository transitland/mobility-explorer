/* global L */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';
import xml2js from 'npm:xml2js';
import polylineEncoded from 'npm:polyline-encoded';


export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox','pin','trace', 'showAttributes'],
  center: Ember.computed('trace', function(){
    // to get center from new gpx:
    // var encodedPolyline = this.model.traceRouteRequest;
    // var decodedPolyline = L.Polyline(L.PolylineUtil.decode(encodedPolyline, 6));
    // var bounds = decodedPolyline.getBounds();
    
    return this.model.gpxTrace ? this.model.gpxTrace.center : this.get('mapCenter');
  }),
  zoom: 14,
  trace: null,
  showMapMatch: false,
  showAttributes: null,
  gpxPlaceholder: Ember.computed('trace', function(){
    if (this.get('trace')){
      return this.get('trace');
    } else {
      return "Select a sample GPX trace...";
    }
  }),
  edges: null,
 
  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
    },

    setTrace(trace){
      this.set('showMapMatch', false);
      this.set('center', trace.center);
      this.set('trace', trace.name);
    },
    
    setShowMapMatch(){
      if (this.get('showMapMatch')){
        this.set('showMapMatch', false);
      } else {
        this.set('showMapMatch', true);
      }
    },

    showAttributes(){
      this.set('edges', this.model.mapMatchRequests.attributes.responseJSON.edges)
      console.log(this.model.mapMatchRequests.attributes.responseJSON)
      if (this.get('showAttributes')){
        this.set('showAttributes', null);
      } else {
        this.set('showAttributes', true);
      }
    }
  }
});