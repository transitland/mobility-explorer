import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  queryParams: {
    onestop_id: {
      refreshModel: true
    },
    bbox: {
      replace: true,
      refreshModel: true
    },
    served_by: {
      refreshModel: true
    },
    isochrone_mode: {
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
          contours: [{"time":15},{"time":30},{"time":45},{"time":60}]
        };
        url += escape(JSON.stringify(json));
        return Ember.RSVP.hash({
          stops: stops,
          onlyStop: onlyStop,
          url: url,
          isochrones: Ember.$.ajax({ url }).then(function(response){
            var polygons= response.features;
            for (var i = 0; i < (polygons.length-1); i++){
              var ring = polygons[i].geometry.coordinates.push(polygons[i+1].geometry.coordinates[0]);
            }
            return response;
          })
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
  }

});