import Ember from 'ember';

export default Ember.Component.extend({
	bBox: null,
	queryParams: {
    bBox: {
      replace: true
    }
  },
	actions: {
		getBbox(e) {
			let bBox = e.target.getBounds();
			this.set('bBox', bBox.toBBoxString());
		}
	}
});
