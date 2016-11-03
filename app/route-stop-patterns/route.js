import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';
import setLoading from 'mobility-playground/mixins/set-loading';

export default Ember.Route.extend(mapBboxRoute, setLoading, {
  queryParams: {
    traversed_by: {
    	refreshModel: true
    },
    pin: {
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
    
    var route_stop_patterns = this.store.query('data/transitland/route_stop_pattern', params);
    var traversedByRoute = this.store.query('data/transitland/route', {onestop_id: params.traversed_by});
    var stopsServedByRoute = this.store.query('data/transitland/stop', {served_by: params.traversed_by});

    return Ember.RSVP.hash({
      route_stop_patterns: route_stop_patterns,
      traversedByRoute: traversedByRoute,
      stopsServedByRoute: stopsServedByRoute
    });
  },
  actions:{
    
  }
});