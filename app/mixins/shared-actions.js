import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		removePin(){
      this.set('pin', null);
    }
	}
});
