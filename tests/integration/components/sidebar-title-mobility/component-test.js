import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidebar-title-mobility', 'Integration | Component | sidebar title mobility', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sidebar-title-mobility}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sidebar-title-mobility}}
      template block text
    {{/sidebar-title-mobility}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
