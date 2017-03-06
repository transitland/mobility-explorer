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
  testLine: Ember.computed('trace', function(){
    var shape = this.model.mapMatchRequests.attributesRequest.shape;
    return L.PolylineUtil.decode(shape, 6);
    // debugger;
  }),
  traceAttributeSegments: Ember.computed('trace', function() {
    console.log('traceAttributeSegments');
    var points = L.PolylineUtil.decode(this.model.mapMatchRequests.attributesRequest.shape, 6);
    var edges = this.model.mapMatchRequests.attributesRequest.edges;
    var edgeCoordinates = [];
    // console.log(edgeCoordinates)
    var edgeMap = edges.map(function(edge) {
      var edgeCoordinates = points.slice(edge.begin_shape_index, edge.end_shape_index + 1)
      return {
        coordinates: edgeCoordinates,
        color: "red"
      }
    });
    return edgeMap   
  }),
 
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
      console.log(this.get('traceAttributeSegments'))
      debugger;
      if (this.get('showAttributes')){
        this.set('showAttributes', null);
      } else {
        this.set('showAttributes', true);
      }
    },

    printSegment(segment){
      console.log(segment.coordinates)
    }
  }
});