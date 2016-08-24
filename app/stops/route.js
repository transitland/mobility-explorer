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
    },
    isochrones_mode: {
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
          contours: [{"time":15},{"time":30},{"time":45},{"time":60}]
        };
        url += escape(JSON.stringify(json));
        return Ember.RSVP.hash({
          stops: stops,
          onlyStop: onlyStop,
          isochrones: Ember.$.ajax({ url })
        });
      } else if (stops.get('query.isochrones_mode')){
        var stopLocations = [];
        var isochrones = [];
        stopLocations = stopLocations.concat(stops.map(function(stop){return stop.get('geometry.coordinates')}))
        
        for (var i = 0; i < stopLocations.length; i++){
          var url = 'https://matrix.mapzen.com/isochrone?api_key=matrix-bHS1xBE&json=';
          var mode = 'pedestrian';
          var json = {
            locations: [{"lat":stopLocations[0][1], "lon":stopLocations[0][0]}],
            costing: mode,
            contours: [{"time":15}]
          };
          url += escape(JSON.stringify(json));
          isochrones.push(Ember.$.ajax({ url }));
        }
        return Ember.RSVP.hash({
          stops: stops,
          isochrones: isochrones
        });
       
      } else {
        var onlyStop = stops.get('firstObject');
        var stopLocation = onlyStop.get('geometry.coordinates');
        var mode = stops.get('query.isochrone_mode');

        return Ember.RSVP.hash({
          stops: stops,
          onlyStop: onlyStop,
        });
      }
    });
  }

});