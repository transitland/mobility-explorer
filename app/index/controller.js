import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';

export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
	queryParams: ['bbox','pin'],
  
  // mapCenter: [43.072963279523,-89.39234018325806],
  center: Ember.computed('pin', function(){
    if (this.get('pin')){
      return this.get('pinLocation');
    } else {
      return this.get('mapCenter');
    }
  }),
  zoom: 14,

	actions: {
		updatebbox(e) {
			var newbox = e.target.getBounds();
			this.set('bbox', newbox.toBBoxString());
		},
    setIsochroneMode: function(mode){
      if (this.get('isochrone_mode') === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    }
  }
});