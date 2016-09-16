import TransitlandSerializer from "../serializer";

export default TransitlandSerializer.extend({
	modelNameFromPayloadKey: function(payloadKey){
		return "data/transitland/route_stop_patterns";
	}
});