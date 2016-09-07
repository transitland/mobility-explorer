import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';


export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox'],
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	place: null,
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20)
	}),

	actions: {
		updatebbox(e) {
			var newbox = e.target.getBounds();
			this.set('bbox', newbox.toBBoxString());
		},
  	searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;      
      return Ember.$.ajax({ url }).then(json => json.features);
    },
  	setPlace: function(selected){
  		this.set('place', selected);
      this.set('bbox', selected.bbox);
      
      var coordinateArray = [];
      var bboxString = this.get('bbox').toString();
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
      this.set('leafletBbox', boundsArray);
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	}
  }
});