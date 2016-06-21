import Ember from 'ember';

export default Ember.Component.extend({
	lat: 37.7749,
	lng: -122.4194,
	zoom: 12,
	bBox: null,
	coordinates: Ember.computed(function(){
	    var coords = this.get('geometry').coordinates.map(function(coord){
	      coord.reverse();
	      console.log('test');
	      return coord;
	    });
	    return coords;
	}),
	resetButton: false,
	testLocation: [37.7749, -122.4194],
	testLocationTwo: [37.7900, -122.4194],
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',
		iconSize: (20, 20)
	}),

	// toLeafletCoordinates: function(coordinates){
	// 	console.log(geometry(['coordinates']).map(function(coord) {return coord.reverse()}));
	// },

	actions: {
		updateBbox(e) {
			var newBox = e.target.getBounds();
			this.set('bBox', newBox.toBBoxString());
			this.get('getBbox')(newBox);
		}
	}
});