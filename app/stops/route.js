import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  queryParams: {
  	onestop_id: {
  		replace: true,
    	refreshModel: true
  	},
    bbox: {
      replace: true,
      refreshModel: true

    }
  },
  
  model: function(params){
    return this.store.query('data/transitland/stop', params);
  }
});