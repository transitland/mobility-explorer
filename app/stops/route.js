import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  queryParams: {
  	onestop_id: {
  		// replace: true,
    	refreshModel: true
  	},
    bbox: {
      replace: true,
      refreshModel: true
    },
    served_by: {
      refreshModel: true
    }
  },

  model: function(params){
    this.store.unloadAll('data/transitland/stop');
    return this.store.query('data/transitland/stop', params);
  }
  // model: function(onestop_id){
  //   return Ember.RSVP.hash({
  //     stops: this.store.query('data/transitland/stop', onestop_id=onestop_id),
  //     routes: this.store.query('data/transitland/route', onestop_id=)
  //   })
  // }
});