import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  // bBox: null,
  queryParams: {
    bBox: {
      replace: true
    }
  },
  
  model: function(params){
    return this.store.query('data/transitland/operator', params);
  }
});
