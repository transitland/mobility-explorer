import Ember from 'ember';

export default Ember.Component.extend({
	bBox: null,
	queryParams: {
    bBox: {
      replace: true
    }
  },
  activeRoute: 'index',
  test: false,
  activeIndexRoute: function(){
  	if (this.test === true){
  		return true;
  	}
  },
  activeOperatorsRoute: function(){
  	if (this.activeRoute === 'operators'){
  		return true;
  	}
  },
  activeRoutesRoute: function(){
  	if(this.activeRoute === 'routes'){
  		return true;
  	}
  },
  activeStopsRoute: function(){
  	if(this.activeRoute === 'stops'){
  		return true;
  	}
  }
});
