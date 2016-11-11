import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		setTextBoxClosed: function(){
			console.log('mixin')
			let controller = this.controllerFor(this.routeName);
			controller.set('textboxIsClosed', true);
		}
	}
});
