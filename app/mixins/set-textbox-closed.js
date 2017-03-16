import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		setTextBoxClosed(){
			this.get('closeTextbox').set('textboxIsClosed', true);
			localStorage.setItem('mobility-explorer-show-intro', 'true');
    },
	}
});
