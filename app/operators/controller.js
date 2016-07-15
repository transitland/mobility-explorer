import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id'],
	bbox: null,
	onestop_id: null,
	selectedOperator: null,
	hoverOperator: null,
	place: null,
	onlyOperator: Ember.computed('onestop_id', function(){
		var data = this.get('operators');
		var onlyOperator = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null
		} else {
			return onlyOperator;
		}
	}),
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			var defaultBoundsArray = [];
			defaultBoundsArray.push([37.706911598228466, -122.54287719726562]);
			defaultBoundsArray.push([37.84259697150785, -122.29568481445312]);
			return defaultBoundsArray;
		} else {
			var coordinateArray = [];
			var bboxString = this.get('bbox');
			var tempArray = [];
			var boundsArray = [];

			coordinateArray = bboxString.split(',');

			for (var i = 0; i < coordinateArray.length; i++){
				tempArray.push(parseFloat(coordinateArray[i]));
			}
		
			var arrayOne = [];
			var arrayTwo = [];
			arrayOne.push(tempArray[1]);
			arrayOne.push(tempArray[0]);
			arrayTwo.push(tempArray[3]);
			arrayTwo.push(tempArray[2]);
			boundsArray.push(arrayOne);
			boundsArray.push(arrayTwo);
			return boundsArray;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20)
	}),
	operators: Ember.computed(function(){
		var data = this.get('model');
		var operators = [];
		operators = operators.concat(data.map(function(operator){return operator;}));
		return operators;
	}),
	actions: {
		setOperator(operator){
			var onestop_id = operator.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedOperator', operator);
		},
		updatebbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
			let zoom = e.target.getZoom();
			this.set('lat', center.lat);
			this.set('lng', center.lng);
			this.set('zoom', zoom);
		},
		setOnestopId(operator) {
			var onestopId = operator.id;
			this.set('onestop_id', onestopId);
			this.set('selectedOperator', operator);
		},
		selectOperator(operator){
			operator.set('operator_path_opacity', 1);
			operator.set('operator_path_weight', 3);
			this.set('hoverOperator', operator);
		},
		unselectOperator(operator){
			operator.set('operator_path_opacity', 0.5);
			operator.set('operator_path_weight', 1.5);
			this.set('hoverOperator', null);
		},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    },
  	setPlace: function(selected){
  		// this.set('place', selected);
  		// this.set('bbox', selected.bbox);
  		var newbbox = selected.bbox;
  		// this.set('onestop_id', null);
  		console.log(newbbox);

  		this.transitionToRoute('index', {queryParams: {bbox: newbbox}});
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	}
	}	
});