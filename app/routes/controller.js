import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bBox'],
	bBox: null,

	actions: {
    setBbox(newBbox) {
	  	let bBox = newBbox;
	    this.set('bBox', bBox.toBBoxString());
    },
    printBbox(){
      console.log("routes bbox: " + this.bBox);
    }
  }
	
});