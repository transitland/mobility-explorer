import Ember from 'ember';
/* global L */

var stopStationIcon = L.icon({
  iconUrl: 'assets/images/search-active.png',
  iconSize: [36, 54],
  iconAnchor: [18, 54],
  popupAnchor: [0, -54]
});

var stopPlatformIcon = L.icon({
  iconUrl: 'assets/images/capital-l.png',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -16]
});

var stopEgressIcon = L.icon({
  iconUrl: 'assets/images/capital-l.png',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -16]
});

export default Ember.Component.extend({
  stopPlatformIcon: stopPlatformIcon,
  stopEgressIcon: stopEgressIcon,
  stopStationIcon: stopStationIcon,
  lat: 0,
  lng: 0,
  zoom: 0,
  bounds: null,
  actions: {
    selectStop(stop) {
      console.log(stop.id);
    },
    updateStopLocation(stop, e) {
      let location = e.target.getLatLng();
      stop.setCoordinates([location.lng, location.lat]);
    }
  }
});
