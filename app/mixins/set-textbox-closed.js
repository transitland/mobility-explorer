import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		setTextBoxClosed(){
      console.log("mixin");
      console.log(this.get('closeTextbox').textboxIsClosed);
      this.get('closeTextbox').set('textboxIsClosed', true);
      // console.log(this.get('closeTextbox').textboxIsClosed);
    },
	}
});
