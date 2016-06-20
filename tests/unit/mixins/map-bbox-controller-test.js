import Ember from 'ember';
import MapBboxControllerMixin from 'mobility-playground/mixins/map-bbox-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | map bbox controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let MapBboxControllerObject = Ember.Object.extend(MapBboxControllerMixin);
  let subject = MapBboxControllerObject.create();
  assert.ok(subject);
});
