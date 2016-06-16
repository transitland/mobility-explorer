import Ember from 'ember';

export default Ember.Route.extend({

	queryParams: {
    bBox: {
      refreshModel: true,
      replace: true
    }
	},

	model: function(params){
		return this.store.query('data/transitland/operator', params);
	}

	// model: function(params){
	// 	let operator = this.store.query('data/transitland/operator', params);
	// 	let feed = this.store.query('data/transitland/feed', params);
	// 	return Ember.RSVP.hash({
	// 		operator: operator,
	// 		feed: feed
	// 	});}

});
