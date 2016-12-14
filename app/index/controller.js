import Ember from 'ember';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';

export default Ember.Controller.extend(setTextboxClosed, sharedActions, {
  queryParams: ['pin'],
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
