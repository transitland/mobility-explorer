import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend({
	queryParams: {
    bbox: {
      replace: true,
      refreshModel: true

    }
	}
});