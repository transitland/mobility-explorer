import Ember from 'ember';

export default Ember.Controller.extend({
	selectedType: "initial",
	bBox: null,
	
  
  initialSelected: Ember.computed('selectedType', function() {
		return (this.get('selectedType') === "initial");
	}),

	routesSelected: Ember.computed('selectedType', function() {
		return (this.get('selectedType') === "routes");
	}),

	stopsSelected: Ember.computed('selectedType', function() {
		return (this.get('selectedType') === "stops");
	}),

	operatorsSelected: Ember.computed('selectedType', function() {
		return (this.get('selectedType') === "operators");
	}),

	actions: {
		getBbox(e) {
			let bBox = e.target.getBounds();
			this.set('bBox', bBox.toBBoxString());
		},
		toggleSelectedType(type){
			this.set('selectedType', type);
		},
		toggleReset(){
			this.toggleProperty('resetButton');
		}
	}

});