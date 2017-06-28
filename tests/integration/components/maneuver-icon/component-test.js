import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('maneuver-icon', 'Integration | Component | maneuver icon', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{maneuver-icon}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#maneuver-icon}}
      template block text
    {{/maneuver-icon}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
