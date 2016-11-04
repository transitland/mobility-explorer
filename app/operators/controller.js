import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id','pin'],
	pin: null,
	pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==="string"){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
	}),
	bbox: null,
	leafletBbox: null,
  leafletBounds: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	queryIsInactive: false,
  currentlyLoading: Ember.inject.service(),
	onestop_id: null,
	selectedOperator: null,
	hoverOperator: null,
	place: null,
	placeholderMessage: Ember.computed('leafletBbox', function(){
		var total = this.model.get('meta.total');
		if (total > 1){
			return  total + " operators";
		} else if (total === 1) {
			return total + " operator"
		}
	}),
	onlyOperator: Ember.computed('onestop_id', function(){
		var data = this.get('operators');
		var onlyOperator = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null
		} else {
			return onlyOperator;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
	operators: Ember.computed('model', function(){
		if (this.get('model') === null){
			return
		} else {
			var data = this.get('model');
			var operators = [];
			operators = operators.concat(data.map(function(operator){return operator;}));
			return operators;
		}	
	}),
	mapMoved: false,
	mousedOver: false,
	actions: {
		setOperator(operator){
			var onestop_id = operator.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedOperator', operator);
		},
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);
		},
		setOnestopId(operator) {
			var onestopId = operator.id;
			this.set('onestop_id', onestopId);
			this.set('selectedOperator', operator);
		},
		selectOperator(operator){
			this.set('selectedOperator', null);
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
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&text=${term}`; 
      return Ember.$.ajax({ url }).then(json => json.features);
    },
   	setPlace: function(selected){

   	// index: 
   		this.set('pin', null);
      var lng = selected.geometry.coordinates[0];
      var lat = selected.geometry.coordinates[1];
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      
  		this.set('place', selected);
      
      

			if (selected.geometry){
        if (selected.properties.accuracy === "point"){
        	console.log("point")
          this.set('pin', coordinates);
      		this.transitionToRoute('index', {queryParams: {pin: this.get('pin')}});
        } else if (selected.properties.accuracy === "centroid"){
        	if (selected.bbox){
        		console.log('bbox')
        		var coordinateArray = [];
        		var bbox = selected.bbox;
			      var bboxString = bbox.toString();
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
			      this.set('bbox', selected.bbox);
      			this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), map_center: selected.geometry.coordinates}});

        	}
        // 	console.log("centroid")
        // 	console.log(selected.bbox)
        // 	this.set('pin', null)
      		// this.transitionToRoute('index', {queryParams: {map_center: coordinates}});
        }
      }

    // original:
    //   if (selected.geometry){
    //     var lng = selected.geometry.coordinates[0];
    //     var lat = selected.geometry.coordinates[1];
    //     var coordinates = [];
    //     coordinates.push(lat);
    //     coordinates.push(lng);
    //     this.set('pin', coordinates);
    //   }
  		// this.set('place', selected);
  		// this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), pin: this.get('pin')}});
  		

  	// last night:
  	// this.set('pin', null);
  	// var lng = selected.geometry.coordinates[0];
    //   var lat = selected.geometry.coordinates[1];
    //   var coordinates = [];
    //   coordinates.push(lat);
    //   coordinates.push(lng);
      
    //   if (selected.properties.accuracy === "point"){
    //     this.set('pin', coordinates);
  		// 	this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), pin: this.get('pin')}});

    //   } else {
    //   	console.log(selected.bbox);
    //   	this.set('bbox', selected.bbox);
    //   	this.controlleFor('index').set('center', coordinates)
    //   	this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
    //   }
    //   this.set('place', selected);

  	},
  	clearPlace(){
  		this.set('place', null);
  	},
  	removePin: function(){
      this.set('pin', null);
    },
  	dropPin: function(e){
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
    }
	}	
});