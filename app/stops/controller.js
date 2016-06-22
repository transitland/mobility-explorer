import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox'],
	bbox: null,
	lat: 37.7749,
	lng: -122.4194,
	zoom: 12,
	bounds: null,
	icon: L.icon({
		iconUrl: 'assets/images/stop.png',		
		iconSize: (7, 7)
	}),
	actions: {
		setbbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
      let zoom = e.target.getZoom();
      this.set('bounds', this.get('bbox'));
      this.set('lat', center.lat);
      this.set('lng', center.lng);
      this.set('zoom', zoom);
			console.log(this.get('bbox'));
			console.log(this.get('center'));
			console.log(this.get('zoom'));
		},
		updatebbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
      let zoom = e.target.getZoom();
      this.set('bounds', this.get('bbox'));
      this.set('lat', center.lat);
      this.set('lng', center.lng);
      this.set('zoom', zoom);
			console.log(this.get('bbox'));
			console.log(this.get('zoom'));
		}
	}	
});