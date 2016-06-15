import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 45.519743,
  lng: -122.680522,
  zoom: 12,
  bBox: null,
  emberConfLocation: [45.528298, -122.662986],
  hotel: [45.530891, -122.655504],
  icon: L.icon({
    iconUrl: 'assets/images/marker.png',
    iconSize: (20, 20)
  }),
  actions: {
    updateCenter(e) {
      let center = e.target.getCenter();
      this.set('lat', center.lat);
      this.set('lng', center.lng);
    },
    getBbox(e) {
      let bBox = e.target.getBounds();
      this.set('bBox', bBox.toBBoxString());

    }
  }
});