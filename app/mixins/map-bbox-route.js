import Ember from 'ember';

export default Ember.Mixin.create({
	queryParams: {
    bBox: {
      replace: true
    }
  }
});
