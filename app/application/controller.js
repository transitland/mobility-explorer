import Ember from 'ember';


export default Ember.Controller.extend({
	bBox: null,
	actions: {
		getBbox(newBbox) {
			let bBox = newBbox;
			this.set('bBox', bBox.toBBoxString());
      console.log(this.bBox);

		}
	}
});