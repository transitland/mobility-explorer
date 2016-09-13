import Ember from 'ember';

export default Ember.Component.extend({
	queryUrl: Ember.computed('bbox', 'onestop_id', function(){
		// var url = "https://transit.land/api/v1/operators?";
		var url = "https://transit.land/api/v1/" + this.entity + "?"
		var arrayOfQueryParams = [];
		console.log(this.type);
		for (var i = 0; i < this.get('queryParams').length; i++){
			if (arrayOfQueryParams.indexOf(this.get('queryParams')[i]) === -1 && this.get(this.get('queryParams')[i]) !== null){
				arrayOfQueryParams.push(this.get('queryParams')[i])
				if (i === 0){
					url = url + this.get('queryParams')[i] + "=" + this.get(this.get('queryParams')[i]);
				} else {
					url = url + "&" + this.get('queryParams')[i] + "=" + this.get(this.get('queryParams')[i]);
				}
			}
		}
		return url;
	}),
});
