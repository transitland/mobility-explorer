import Ember from 'ember';
import SetLoadingMixin from 'mobility-playground/mixins/set-loading';
import { module, test } from 'qunit';

module('Unit | Mixin | set loading');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetLoadingObject = Ember.Object.extend(SetLoadingMixin);
  let subject = SetLoadingObject.create();
  assert.ok(subject);
});
