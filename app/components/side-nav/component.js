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
  	if (activeRoute === 'operators'){
  		return true;
  	}
  },
  activeRoutesRoute: function(){
  	if(activeRoute === 'routes'){
  		return true;
  	}
  },
  activeStopsRoute: function(){
  	if(activeRoute === 'stops'){
  		return true;
  	}
  }
});
