import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
    bBox: {
      replace: true
    }
  },
  model: function(params){
    return this.store.query('data/transitland/route', params);
  }
});
