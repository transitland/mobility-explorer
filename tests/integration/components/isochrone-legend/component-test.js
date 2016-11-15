import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('isochrone-legend', 'Integration | Component | isochrone legend', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{isochrone-legend}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#isochrone-legend}}
      template block text
    {{/isochrone-legend}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
