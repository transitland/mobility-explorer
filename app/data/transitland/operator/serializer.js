import TransitlandSerializer from "../serializer";

export default TransitlandSerializer.extend({
	attrs: {
		feeds: {
			key: 'represented_in_feed_onestop_ids'
		}
	},

	modelNameFromPayloadKey: function(payloadKey){
		return "data/transitland/operator";
	}

});