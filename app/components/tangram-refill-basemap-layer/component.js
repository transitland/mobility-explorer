import BaseLayer from 'ember-leaflet/components/base-layer';

export default BaseLayer.extend({
  leafletRequiredOptions: [],
  leafletOptions: [],
  createLayer() {
    return Tangram.leafletLayer({
      scene: 'assets/tangram-basemap-scene.yml',
      attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://www.mapzen.com">Mapzen</a> | <a href="http://www.transit.land">Transitland</a>'
    });
  }
});
