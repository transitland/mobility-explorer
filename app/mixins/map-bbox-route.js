import Ember from 'ember';

export default Ember.Mixin.create({
	queryParams: {
    bbox: {
      replace: true
    }
  }
});
