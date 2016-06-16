import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    bBox: {
      refreshModel: true
    }
  }
  
});
