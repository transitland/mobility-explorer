import Ember from 'ember';

export default Ember.Component.extend({
	mode: Ember.computed('isochrone_mode', function(){
		if (this.get('isochrone_mode') === "pedestrian"){
			return "walk";
		} else if (this.get('isochrone_mode') === "bicycle"){
			return "ride";
		} else if (this.get('isochrone_mode') === 'multimodal'){
			return "trip";
		} else if (this.get('isochrone_mode') === 'auto'){
			return "drive";
		}
	})
});
