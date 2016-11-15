import Ember from 'ember';
import SetTextboxClosedMixin from 'mobility-playground/mixins/set-textbox-closed';
import { module, test } from 'qunit';

module('Unit | Mixin | set textbox closed');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetTextboxClosedObject = Ember.Object.extend(SetTextboxClosedMixin);
  let subject = SetTextboxClosedObject.create();
  assert.ok(subject);
});
