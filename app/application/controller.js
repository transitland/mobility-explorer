import Ember from 'ember';
// import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

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