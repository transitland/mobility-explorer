import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');    
    return this.store.query('data/transitland/rsp', params);
  }
});
