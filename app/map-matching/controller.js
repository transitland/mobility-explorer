import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';
import xml2js from 'npm:xml2js';
import polylineEncoded from 'npm:polyline-encoded';


export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox','pin'],
  center: Ember.computed('pin', function(){
    if (this.get('pin')){
      return this.get('pinLocation');
    } else {
      return this.get('mapCenter');
    }
  }),
  zoom: 14,
  activeTrace: null,
  showMapMatch: false,
  gpxPlaceholder: Ember.computed('activeTrace', function(){
    if (this.get('activeTrace')){
      return this.get('activeTrace');
    } else {
      return "Select a sample GPX trace...";
    }
  }),

  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
    },

    setTrace(trace){
      this.set('activeTrace', trace.name);
      this.set('showMapMatch', false);
      var encodedPolyline = trace.traceRoute.responseJSON.trip.legs[0].shape;
      var polyline = L.polyline(L.PolylineUtil.decode(encodedPolyline, 6));

      // for (var i=0; i < this.model.traces.length; i++){
      for (var i=0; i < 1; i++){
        if (this.model.traces[i].traceRoute.responseJSON.trip.legs[0].shape === encodedPolyline){
          this.model.traces[i].polyline = polyline._latlngs;
        }
      }
    },
    
    setShowMapMatch(){
      if (this.get('showMapMatch')){
        this.set('showMapMatch', false);
      } else {
        this.set('showMapMatch', true);
      }
    }
  }
});