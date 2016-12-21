import Ember from 'ember';
import DS from 'ember-data';
import Stop from 'dispatcher/stop/model';

function next_fragment(entities, separator) {
  var ids = entities.map(function(i) {return i.id.split(separator)[1]; });
  var fragment = "";
  for (var i=0; i < 1000; i++) {
    fragment = String(i);
    if (ids.indexOf(fragment) === -1) {
      break;
    }
  }
  return fragment;
}

export default Stop.extend({
  stop_platforms: DS.hasMany('stop-platform', { modelFor: 'stop-platform', inverse: 'parent_stop'}),
  stop_egresses:  DS.hasMany('stop-egress', { modelFor: 'stop-egress', inverse: 'parent_stop'}),
  stationPlatformLines: Ember.computed('geometry', 'stop_platforms.@each.geometry', function() {
    var origin = this.get('coordinates');
    return this.get('stop_platforms').map(function(stop_platform) {
      return [origin, stop_platform.get('coordinates')];
    });
  }),
  stationEgressLines: Ember.computed('geometry', 'stop_egresses.@each.geometry', function() {
    var origin = this.get('coordinates');
    return this.get('stop_egresses').map(function(stop_platform) {
      return [origin, stop_platform.get('coordinates')];
    });
  }),
  newPlatform: function() {
    var separator = '<';
    var fragment = next_fragment(this.get('stop_platforms'), separator);
    return this.get('stop_platforms').createRecord(
      {
        id: this.id + separator + fragment,
        timezone: this.get('timezone'),
        geometry: this.get('geometry'),
        name: 'New Platform'
      }
    );
  },
  newEgress: function() {
    var separator = '>';
    var fragment = next_fragment(this.get('stop_egresses'), separator);
    return this.get('stop_egresses').createRecord(
      {
        id: this.id + separator + fragment,
        timezone: this.get('timezone'),
        geometry: this.get('geometry'),
        name: 'New Egress'
      }
    );
  }
});
