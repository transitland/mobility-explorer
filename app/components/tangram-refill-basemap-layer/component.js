import BaseLayer from 'ember-leaflet/components/base-layer';

export default BaseLayer.extend({
  leafletRequiredOptions: [],
  leafletOptions: [],
  createLayer() {
    return Tangram.leafletLayer({
      scene: 'assets/tangram-basemap-scene.yml',
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.mapzen.com">Mapzen</a> | <a href="http://www.transit.land">Transitland</a> | Imagery © <a href="https://carto.com/">CARTO</a>'
    });
  }
});
