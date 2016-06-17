import Ember from 'ember';

export default Ember.Controller.extend({
	bBox: null,
	actions: {
		getBbox(e) {
			let bBox = e.target.getBounds();
			this.set('bBox', bBox.toBBoxString());
		}
	}
});