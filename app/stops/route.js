import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';
import setLoading from 'mobility-playground/mixins/set-loading';

export default Ember.Route.extend(mapBboxRoute, setLoading, {
  queryParams: {
    onestop_id: {
      refreshModel: true
    },
    served_by: {
      refreshModel: true
    },
    isochrone_mode: {
      replace: true,
      refreshModel: true,
    },
    isochrones_mode: {
       replace: true,
      refreshModel: true,
    },
    bus_only: {
      replace: true,
      refreshModel: true,
    }
  },
  setupController: function (controller, model) {
    if (controller.get('bbox') !== null){
      var coordinateArray = [];
      var bboxString = controller.get('bbox');
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
      controller.set('leafletBbox', boundsArray);
    }
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern');
    var self = this;
    return this.store.query('data/transitland/stop', params).then(function(stops) {
      if (stops.get('query.isochrone_mode')){
        var onlyStop = stops.get('firstObject');
        var stopLocation = onlyStop.get('geometry.coordinates');
        var url = 'https://matrix.mapzen.com/isochrone?api_key=matrix-bHS1xBE&json=';
        var mode = stops.get('query.isochrone_mode');
        var json = {
          locations: [{"lat":stopLocation[1], "lon":stopLocation[0]}],
          costing: mode,
          costing_options: {"pedestrian":{"use_ferry":0}},
          contours: [{"time":15},{"time":30},{"time":45},{"time":60}],
          denoise: .1,
        };
        url += escape(JSON.stringify(json));
        return Ember.RSVP.hash({
          stops: stops,
          onlyStop: onlyStop,
          url: url,
          // isochrones: Ember.$.ajax({ url }).then(function(response){
          //   var polygons= response.features;
          //   for (var i = 0; i < (polygons.length-1); i++){
          //     if(response.features[i].properties.contour === response.features[i+1].properties.contour) {
          //       polygons[i].geometry.coordinates.push(polygons[i+1].geometry.coordinates);
          //     }
          //   }
          //   return response;
          // })
          
          isochrones: Ember.$.ajax({ url }).then(function(response){
           //for each feature
           for(var i = 0; i < response.features.length-1; i++) {
             //we need to find the first range of contours features who have different
             //contour values than the current contour we are on
             var range_begin = i + 1;
             var range_end = range_begin;

             while(range_begin < response.features.length-1 && range_end < response.features.length-1) {

              if(response.features[i].properties.contour == response.features[range_begin].properties.contour) {
                 range_begin++;
                 range_end = range_begin;
              } 
              if(response.features[range_begin].properties.contour == response.features[range_end].properties.contour) {
                 range_end++;
              } else {
                 break;
              }
             }
             //copy this range of features into the current feature as an inner ring
             //this will make a cut out. TODO: reverse the winding of this inner is more proper
            for(var f = range_begin; f < range_end; f++)
              response.features[i].geometry.coordinates.push(response.features[f].geometry.coordinates[0]);
           }
           return response;
          })
          
          
          // isochrones: Ember.$.ajax({ url }).then(function(response){
          //  //for each feature
          //   var group60 = [];
          //   var group45 = [];
          //   var group30 = [];
          //   var group15 = [];
          //   for (var i = 0; i < response.features.length-1; i++) {
          //     //we need to find the first range of contours features who have different
          //     //contour values than the current contour we are on
              
          //     if(response.features[i].properties.contour === response.features[i+1].properties.contour) {
          //       // response.features[i].geometry.coordinates.push(response.features[i+1].geometry.coordinates[0]);
          //       if (response.features[i].properties.contour === 60){
          //         group60.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 45){
          //         group45.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 30){
          //         group30.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 15){
          //         group15.push(response.features[i]);
          //       }
          //     } else if (response.features[i].properties.contour !== response.features[i+1].properties.contour){
          //       if (response.features[i].properties.contour === 60){
          //         group60.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 45){
          //         group45.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 30){
          //         group30.push(response.features[i]);
          //       } else if (response.features[i].properties.contour === 15){
          //         group15.push(response.features[i]);
          //       }
          //     }
          //   }
          //   for (var i = 0; i < group15.length; i++) {
          //     console.log("group15" + i);
          //   }


          // })
        });
      } else {
        var onlyStop = stops.get('firstObject');
        var stopLocation = onlyStop.get('geometry.coordinates');
        var mode = stops.get('query.isochrone_mode');
        var servedBy = stops.get('query.served_by');
        if (servedBy!== null){
          if (servedBy.indexOf('r') === 0) {
            var url = 'https://transit.land/api/v1/routes.geojson?onestop_id=';
            url += servedBy;
            return Ember.RSVP.hash({
              stops: stops,
              onlyStop: onlyStop,
              servedByRoute: Ember.$.ajax({ url })
            });
          } else {
            return Ember.RSVP.hash({
              stops: stops,
              onlyStop: onlyStop
            });
          }
        } else {
          return Ember.RSVP.hash({
            stops: stops,
            onlyStop: onlyStop
          });
        }
      }
    });
  },
  actions: {
    
  }

});