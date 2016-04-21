import DS from 'ember-data';

import ENV from 'mobility-playground/config/environment';

export default DS.RESTAdapter.extend({
	host: ENV.transitlandDatastoreHost,
	namespace: 'api/v1',
	coalesceFindRequests: true
});