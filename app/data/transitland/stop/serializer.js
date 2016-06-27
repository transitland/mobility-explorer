import TransitlandSerializer from "../serializer";

export default TransitlandSerializer.extend({
	// attrs: {
	// 	routes: {
	// 		key: 'routes_serving_stop.route_onestop_id'
	// 	}
	// },
	modelNameFromPayloadKey: function(payloadKey){
		return "data/transitland/stop";
	}


});