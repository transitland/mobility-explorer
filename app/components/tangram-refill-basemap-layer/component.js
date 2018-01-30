import BaseLayer from 'ember-leaflet/components/base-layer';

export default BaseLayer.extend({
  leafletRequiredOptions: [],
  leafletOptions: [],
  createLayer() {
    return Tangram.leafletLayer({
      scene: 'assets/tangram-basemap-scene.yml',
      attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="https://www.nextzen.org">Nextzen</a> | <a href="https://transit.land">Transitland</a>'
    });
  }
});
