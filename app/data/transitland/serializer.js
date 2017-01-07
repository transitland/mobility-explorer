import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	// Custom json root. The API returns objects in the "data" key.
	// We need to re-assign it to the singular version of the model name.
	// So {data: {name: foo}} becomes {post: {name: foo}}
	extractSingle: function(store, primaryType, rawPayload, recordId) {
		var typeKey = primaryType.typeKey;
		var payload = {};
		payload[typeKey] = rawPayload;

		return this._super(store, primaryType, payload, recordId);
	},

	primaryKey: 'onestop_id',

	extractMeta: function(store, typeClass, payload) {
		if (payload && payload.hasOwnProperty('meta')) {
			if (!payload.meta.hasOwnProperty('next') || Ember.isEmpty(payload.meta.next)) {
			// The meta.next property will be used by app/mixins/paginated-controller
			// to decide if there's another page of results. By default, Ember Data
			// won't nullify the meta properties from a past result. So we'll do that
			// here...
				payload.meta.next = null;
			}
		}
		return this._super(store, typeClass, payload);
	}

});
