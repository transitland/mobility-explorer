import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  queryParams: {
  
    traversed_by: {
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
      controller.set('leafletBbox', boundsArray);
    }
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern');
    return this.store.query('data/transitland/route_stop_pattern', params).then(function(route_stop_patterns){
      var firstRsp = route_stop_patterns.get('firstObject');
      var routeOnestopId = firstRsp.get('route_onestop_id');
      if (routeOnestopId !== null){
        if (routeOnestopId.indexOf('r') === 0) {
          var url = 'https://transit.land/api/v1/routes.geojson?onestop_id=';
          url += routeOnestopId;
          // var traversedByRoute = Ember.$.ajax({ url }).then(function(response){
          // debugger;
            
          // })
          return Ember.RSVP.hash({
            route_stop_patterns: route_stop_patterns,
            traversedByRoute: Ember.$.ajax({ url })
          });
        } else {
          return Ember.RSVP.hash({
            route_stop_patterns: route_stop_patterns,
          });
        }
      } else {
        return Ember.RSVP.hash({
          route_stop_patterns: route_stop_patterns,
        });
      }
    });
  }
});