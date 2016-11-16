import Ember from 'ember';
import GooglePageviewMixin from 'mobility-playground/mixins/google-pageview';
import { module, test } from 'qunit';

module('Unit | Mixin | google pageview');

// Replace this with your real tests.
test('it works', function(assert) {
  let GooglePageviewObject = Ember.Object.extend(GooglePageviewMixin);
  let subject = GooglePageviewObject.create();
  assert.ok(subject);
});
