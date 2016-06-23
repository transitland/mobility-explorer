import DS from 'ember-data';

import ENV from 'mobility-playground/config/environment';

export default DS.RESTAdapter.extend({
	host: ENV.transitlandDatastoreHost,
	namespace: 'api/v1',
	coalesceFindRequests: true,
	ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);
    if (type === 'GET') {
      let data = {};
      if (typeof(hash.data) === 'string') {
        data = JSON.parse(hash.data);
      } else if (typeof(hash.data) !== "undefined") {
        data = hash.data;
      } else {
        data = {};
      }
      data["per_page"] = false;
      hash.data = data;
    }
    return hash;
	}
});