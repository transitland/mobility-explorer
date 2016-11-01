import Ember from 'ember';

export default Ember.Component.extend({
	pedestrianIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'pedestrian');
	}),
	bicycleIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'bicycle');
	}),
	multimodalIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'multimodal');
	}),
	autoIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'auto');
	}),
	actions:{
		setIsochroneMode(mode){
  		if (this.get('isochrone_mode') === mode){
  			this.set('isochrone_mode', null);
  		} else {
  			this.set('isochrone_mode', mode);
  		}
		},
		setIsochronesMode(){
  		if (this.get('isochrones_mode') === null){
  			this.set('isochrones_mode', true);
  		} else {
  			this.set('isochrones_mode', null);
  		}
  	},
	}
});
