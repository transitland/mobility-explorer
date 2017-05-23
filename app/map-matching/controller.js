/* global L */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';
import xml2js from 'npm:xml2js';
import polylineEncoded from 'npm:polyline-encoded';

export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox','pin','trace', 'costing'],
  zoom: 14,
  trace: null,
  costing: null,
  uploading: false,
  showMapMatch: false,
  showTraceRoute: false,
  errorMessage: null,
  showErrorMessage: false,
  noTraceUploaded: false,
  showTraceErrorMessage: false,
  selectedAttribute: null,
  selectedTrace: Ember.computed('trace', function(){
    if (!this.get('trace')) {
      return "Select a sample or upload your own file";
    } else if (this.get('trace') && this.get('gpxPlaceholder') === "Select a sample GPX trace..."){
      return this.model.gpxTrace.display_name;
    } else if (this.get('trace') && this.get('trace').name === "user_upload"){
      return this.get('gpxPlaceholder');
    } else {
      return this.get('gpxPlaceholder');
    }
  }),
  gpxPlaceholder: "Select a sample GPX trace...",
  edges: null,
  maxUpwardGrade: null,
  maxDownwardGrade: null,
  attributesForSelection: [{ attribute: "weighted_grade", display_name: "grade" }, { attribute: "speed", display_name: "speed" }],
  html:'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="15px" width="15px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg>',
  hoverSegment: null,
  selectedSegment: null,
  attributeDisplay: {
    "id": {
      "display_name": "ID",
      "units": ""
    },
    "speed": {
      "display_name": "speed",
      "units": " mph"
    },
    "max_upward_grade": {
      "display_name": "max upward grade",
      "units": "%"
    },
    "end_heading": {
      "display_name": "end heading",
      "units": ""
    },
    "travel_mode": {
      "display_name": "travel mode",
      "units": ""
    },
    "speed_limit": {
      "display_name": "speed limit",
      "units": " mph"
    },
    "bicycle_network": {
      "display_name": "bicycle network",
      "units": ""
    },
    "surface": {
      "display_name": "surface",
      "units": ""
    },
    "end_shape_index": {
      "display_name": "skip",
      "units": ""
    },
    "density": {
      "display_name": "density",
      "units": ""
    },
    "way_id": {
      "display_name": "OSM way id",
      "units": ""
    },
    "vehicle_type": {
      "display_name": "vehicle type",
      "units": ""
    },
    "drive_on_right": {
      "display_name": "drive on right",
      "units": ""
    },
    "use": {
      "display_name": "use",
      "units": ""
    },
    "lane_count": {
      "display_name": "lane count",
      "units": ""
    },
    "traversability": {
      "display_name": "traversability",
      "units": ""
    },
    "begin_shape_index": {
      "display_name": "skip",
      "units": ""
    },
    "end_node": {
      "display_name": "skip",
      "units": ""
    },
    "sign": {
      "display_name": "skip",
      "units": ""
    },
    "begin_heading": {
      "display_name": "begin heading",
      "units": ""
    },
    "road_class": {
      "display_name": "road class",
      "units": ""
    },
    "length": {
      "display_name": "length",
      "units": " miles"
    },
    "weighted_grade": {
      "display_name": "weighted grade",
      "units": "%"
    },
    "max_downward_grade": {
      "display_name": "max downward grade",
      "units": "%"
    }
  },
  segmentPopupContent: Ember.computed('hoverSegment', function(){
    var selectedAttribute = this.get('selectedAttribute');
    var attributes = this.get('hoverSegment').attributes;
    var attributeValue = attributes[selectedAttribute];
    if (selectedAttribute === 'weighted_grade') {
      if (attributes.max_upward_grade !== 0 && attributes.max_downward_grade !== 0) {
        // return "weighted grade: " + attributes.weighted_grade + "%";
        if (-attributes.max_downward_grade >= attributes.max_upward_grade){
          return "max downward grade: " + attributes.max_downward_grade + "%"; 
        } else {
          return "max upward grade: " + attributes.max_upward_grade + "%";
        }
      } else if (attributes.max_upward_grade !== 0) {
        return "max upward grade: " + attributes.max_upward_grade + "%";
      } else if (attributes.max_downward_grade !== 0) {
        return "max downward grade: " + attributes.max_downward_grade + "%"; 
      }
    } else {
      return "speed limit: " + attributes[selectedAttribute] + " mph";
    }
  }),
  routeManeuvers: Ember.computed('showTraceRoute', function(){
    // debugger;
    // var maneuvers = this.model.traceRouteRequest.trip.legs[0].maneuvers;
    var maneuvers = this.model.mapMatchRequests.traceRouteRequest.trip.legs[0].maneuvers;
    return maneuvers;
  }),
  segmentAttributes: Ember.computed('selectedSegment', function(){
    if (this.get('selectedSegment')){
      var attributes = this.get('selectedSegment').attributes;
      var attributeArray = [];
      var attributeDisplay = this.get('attributeDisplay');
      for (var attribute in attributes){
        if (attributeDisplay[attribute]){
          var value = attributes[attribute].toString() + attributeDisplay[attribute].units;
          attributeArray.push({"attribute":attributeDisplay[attribute].display_name, "value":value});
        } else if (attribute.indexOf('_') > -1){
          var attributeWithoutUnderscore = attribute.replace(/_/gi, ' ');
          attributeArray.push({"attribute":attributeWithoutUnderscore, "value":attributes[attribute]});
        } else {
          attributeArray.push({"attribute":attribute, "value":attributes[attribute]});
        }
      }
      // sort by attribute name
      attributeArray.sort(function(a, b) {
        var attributeA = a.attribute.toUpperCase(); // ignore upper and lowercase
        var attributeB = b.attribute.toUpperCase(); // ignore upper and lowercase
        if (attributeA < attributeB) {
          return -1;
        }
        if (attributeA > attributeB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      return attributeArray;
    } else {
      return false;
    }
  }),
  traceAttributeSegments: Ember.computed('selectedAttribute', function() {
    if (this.get('trace')){
      var points = this.model.mapMatchRequests.decodedPolyline;
      // var points = this.model.mapMatchRequests.attributesResponse.matched_points;
      var edges = this.model.mapMatchRequests.attributesResponse.edges;
      var selectedAttribute = this.get('selectedAttribute');
      var edgeCoordinates = [];
      var attributeArray = [];
      var attributeArraySum = 0;
      console.log(this.model.mapMatchRequests)
      for (var i = 0; i < edges.length; i++){
        var attribute;
        // decide whether to use max_upward_grade and max_downward_grade or wieghted_grade
        if (selectedAttribute === 'weighted_grade') {
          if (edges[i].max_upward_grade !== 0 && edges[i].max_downward_grade !== 0) {
            if (-edges[i].max_downward_grade >= edges[i].max_upward_grade){
              attribute = edges[i].max_downward_grade; 
            } else {
              attribute = edges[i].max_upward_grade;
            }
          } else if (edges[i].max_upward_grade !== 0) {
            attribute = edges[i].max_upward_grade;
          } else if (edges[i].max_downward_grade !== 0) {
            attribute = edges[i].max_downward_grade; 
          }
        } else {
          // set attribute to the value for the selected attribute
          attribute = edges[i][selectedAttribute];
        }
        // add attribute to attributeArray
        attributeArray.push(attribute);
        // increment attributeArraySum, to use to find average later
        attributeArraySum = attributeArraySum + attribute;
      }
      // sort attributeArray in ascending order
      attributeArray.sort(function(a,b){return a - b;});
      // find the minimum value in attributeArray
      var attributeArrayMin = attributeArray[0];
      this.set('maxDownwardGrade', attributeArrayMin);
      // find the maximum value in attributeArray
      var attributeArrayMax = attributeArray[attributeArray.length-1];
      this.set('maxUpwardGrade', attributeArrayMax);
      // find the average value for the attribute
      var attributeArrayAverage = attributeArraySum / attributeArray.length;
      // find the median value for the attribute (to use to test with different attributes)
      var attributeArrayMedian = attributeArray[Math.floor(attributeArray.length/2)];

      for (var i = 0; i < edges.length; i++){
        // create coordinate array for segment
        var begin = edges[i].begin_shape_index;
        var end =  edges[i].end_shape_index;
        var pointsSlice = points.slice(begin, end+1);
        var attributes = edges[i];    
        var mid = 0;
        // var mid = attributeArrayAverage;
        // var mid = attributeArrayMedian;  
        var min = attributeArrayMin;
        var max = attributeArrayMax;
      
        var attr = edges[i][selectedAttribute];
        
        // find color
        if (selectedAttribute === 'weighted_grade') {
          
          // Hue is a degree on the color wheel; 0 (or 360) is red, 120 is green, 240 is blue. Numbers in between reflect different shades.
          // Saturation is a percentage value; 100% is the full colour.
          // Lightness is also a percentage; 0% is dark (black), 100% is light (white), and 50% is the average.

          // HSL
          // blue: 240
          // green: 120
          // yellow: 60
          // red: 0 or 360

          var range = attributeArrayMax - attributeArrayMin;
          var percentage = (attr + attributeArrayMin) / range;
          var highColor = 0;
          var midColor = 120;
          var lowColor = 280;
      
          // set color scale around midpoint
          if (attr <= mid){
            var hue = (percentage * (midColor - lowColor));
            var color = 'hsl(' + hue + ', 90%, 50%)';
          } else if (attr > mid) {
            var hue = (percentage * (highColor - midColor));
            var color =  'hsl(' + hue + ', 90%, 50%)';
          }
        } else if (selectedAttribute === 'speed') {
          if (attr >= 70)
            var color = '#313695 ';
          else if (attr >= 65)
            var color = '#4575b4 ';
          else if (attr >= 60)
            var color = '#74add1 ';
          else if (attr >= 55)
            var color = '#abd9e9 ';
          else if (attr >= 50)
            var color = '#e0f3f8 ';
          else if (attr >= 45)
            var color = '#fee090 ';
          else if (attr >= 40)
            var color = '#fdae61 ';
          else if (attr >= 35)
            var color = '#f46d43 ';
          else if (attr >= 30)
            var color = '#d73027 ';
          else if (attr < 30)
            var color = '#a50026 ';
       }
        // add segment info to edgeCoordinates array, to use to draw polyline layers on map 
        edgeCoordinates.push({
          coordinates: pointsSlice,
          color: color,
          attribute: attribute,
          attributes: attributes
        })
      }
      return edgeCoordinates;
    }
  }),

// if attribute style selected, show key for colors
// if hoverSegment, show attribute value for selected attribute
// if no selected style, color segment, provide some detail on hover
// onclick for all, show full attribute table
 
  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
    },
    setTrace(trace){      
      this.set('trace', null);
      this.set('costing', null);
      this.set('showErrorMessage', false);
      this.set('showTraceErrorMessage', false);
      this.set('noTraceUploaded', false);
      this.set('uploading', false);
      if (document.getElementById('gpxFileUpload')){
        document.getElementById('gpxFileUpload').value = "";
      };
      this.set('selectedSegment', null);      
      this.set('showMapMatch', false);
      this.set('selectedAttribute', null);
      this.set('trace', trace.name);
      // if (trace.name !== "user_upload"){
      //   this.set('costing',trace.costing);
      // }
      if (trace.name === "user_upload"){
        this.set('uploading', true);
      } else {
        this.set('uploading', false);
      }
      this.set('gpxPlaceholder', trace.display_name);
    },
    setUploading(){
      this.toggleProperty('uploading');
    },
    setShowMapMatch(){
      if (this.model.mapMatchRequests.error){
        this.set('errorMessage', this.model.mapMatchRequests.error);
        this.set('showErrorMessage', true);
      } else if (this.get('showMapMatch')){
        this.set('showMapMatch', false);
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
      } else {
        this.set('selectedAttribute', null);
        this.set('showMapMatch', true);
      }
    },
    setShowTraceRoute(){
      // TODO: set up error message
      if (this.model.mapMatchRequests.error){
        this.set('errorMessage', this.model.mapMatchRequests.error);
        this.set('showErrorMessage', true);
      } else if (this.get('showTraceRoute')){
        this.set('showTraceRoute', false);     
      } else {
        this.set('showTraceRoute', true);
      }
    },
    styleByAttribute(attribute){
      if (this.get('selectedAttribute') === attribute){
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
      } else {
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
        var attributesForSelection = this.get('attributesForSelection');
        for (var i = 0; i < attributesForSelection.length; i++){
          if (attributesForSelection[i].attribute === attribute){
            this.set('selectedAttribute', attributesForSelection[i].attribute);
          }
        }   
      }
    },
    selectSegment(segment){
      this.set('hoverSegment', segment);
    },
    unselectSegment(segment){
      this.set('hoverSegment', null);
    },
    setSegment(segment){
      this.set('selectedSegment', segment);      
    },
    setCosting(mode){
      this.set('noTraceUploaded', false);
      this.set('trace', null);
      if (this.get('costing') === mode){
        this.set('costing', null);
      } else {
        this.set('costing', mode);
      }
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (document.getElementById('gpxFileUpload').files.length > 0){
          this.set('gpxPlaceholder', 'your trace');
          this.set('uploading', false);
          this.set('selectedAttribute', null);
          this.set('trace', 'user_upload');
        } else {
          this.set('noTraceUploaded', true);
          this.set('costing', null);
        }
        
      } else {
       alert('Sorry, this functionality is not fully supported in your browser.');
      }
    },
    closePopup(){
      this.set('selectedSegment', null);      
    }
  }
});