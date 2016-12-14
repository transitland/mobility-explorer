import Ember from 'ember';
import setLoading from 'mobility-playground/mixins/set-loading';

export default Ember.Route.extend(setLoading, {
  queryParams: {
    onestop_id: {
      // replace: true,
      refreshModel: true
    },
    pin: {
      replace: true,
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
    params.total=true;
    params.pin=null;
    params.bbox = this.paramsFor('application').bbox;
    return this.store.query('data/transitland/operator', params);
  },
  actions:{

  }
});
