import TransitlandAdapter from "../adapter";

export default TransitlandAdapter.extend({
	pathForType: function(modelName){
		return "route_stop_patterns";
	}

});