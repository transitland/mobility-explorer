import Ember from 'ember';

export default Ember.Route.extend({
  bBox: null,
  queryParams: {
    bBox: {
      replace: true
    }
  },
  actions: {
    getBbox(newBbox) {
      let bBox = newBbox;
      this.set('bBox', bBox.toBBoxString());
      console.log(this.bBox);

    }
  },
  model: function(params){
    return this.store.query('data/transitland/operator', params);
  }
});
