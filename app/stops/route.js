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
    pin: {
      replace: true
    },
    departure_time: {
      replace: true,
      refreshModel: true
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
      controller.set('leafletBounds', boundsArray);
    }
    controller.set('leafletBbox', controller.get('bbox'));
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern');
    return this.store.query('data/transitland/stop', params).then(function(stops) {
      var onlyStop, stopLocation, mode, url;
      if (stops.get('query.isochrone_mode')){
        onlyStop = stops.get('firstObject');
        stopLocation = onlyStop.get('geometry.coordinates');
        url = 'https://matrix.mapzen.com/isochrone?api_key=mapzen-jLrDBSP&json=';
        var linkUrl = 'https://matrix.mapzen.com/isochrone?json=';

        mode = stops.get('query.isochrone_mode');
        var json = {
          locations: [{"lat":stopLocation[1], "lon":stopLocation[0]}],
          costing: mode,
          denoise: 0.3,
          polygons: true,
          generalize: 50,
          costing_options: {"pedestrian":{"use_ferry":0}},
          contours: [{"time":15},{"time":30},{"time":45},{"time":60}],
        };
        if (json.costing === "multimodal"){
          json.denoise = 0;
          // transit_start_end_max_distance default is 2145 or about 1.5 miles for start/end distance:
          // transit_transfer_max_distance default is 800 or 0.5 miles for transfer distance:
          json.costing_options = {"pedestrian":{"use_ferry":0,"transit_start_end_max_distance":100000,"transit_transfer_max_distance":100000}};
        }
        if (params.departure_time){
          json.date_time = {"type": 1, "value": params.departure_time};
        }
        url = encodeURI(url + JSON.stringify(json));
        linkUrl = encodeURI(linkUrl + JSON.stringify(json));
        return Ember.RSVP.hash({
          stops: stops,
          onlyStop: onlyStop,
          url: url,
          linkUrl: linkUrl,
          isochrones: Ember.$.ajax({ url }).then(function(response){
            return response;
          })
        });
      } else {
        onlyStop = stops.get('firstObject');
        stopLocation = onlyStop.get('geometry.coordinates');
        mode = stops.get('query.isochrone_mode');
        var servedBy = stops.get('query.served_by');
        if (servedBy!== null){
          if (servedBy.indexOf('r') === 0) {
            url = 'https://transit.land/api/v1/routes.geojson?per_page=false&onestop_id=';
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
