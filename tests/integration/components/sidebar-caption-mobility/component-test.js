import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidebar-caption-mobility', 'Integration | Component | sidebar caption mobility', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sidebar-caption-mobility}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sidebar-caption-mobility}}
      template block text
    {{/sidebar-caption-mobility}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
