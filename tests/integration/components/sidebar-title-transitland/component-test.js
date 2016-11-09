import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidebar-title-transitland', 'Integration | Component | sidebar title transitland', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sidebar-title-transitland}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sidebar-title-transitland}}
      template block text
    {{/sidebar-title-transitland}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
