/* global L */

import Ember from 'ember';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';


export default Ember.Controller.extend(setTextboxClosed, sharedActions, {
	queryParams: ['onestop_id','pin'],
	queryIsInactive: false,
	onestop_id: null,
	selectedOperator: null,
	hoverOperator: null,
	placeholderMessage: Ember.computed('leafletBbox', function(){
		var total = this.model.get('meta.total');
		if (total > 1){
			return  total + " operators";
		} else if (total === 1) {
			return total + " operator";
		}
	}),
	onlyOperator: Ember.computed('onestop_id', function(){
		var data = this.get('operators');
		var onlyOperator = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null;
		} else {
			return onlyOperator;
		}
	}),
	operators: Ember.computed('model', function(){
		if (this.get('model') === null){
			return;
		} else {
			var data = this.get('model');
			var operators = [];
			operators = operators.concat(data.map(function(operator){return operator;}));
			return operators;
		}
	}),
	mapMoved: false,
	mousedOver: false,

	actions: {
		setOperator(operator){
			var onestop_id = operator.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedOperator', operator);
		},
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);
		},
		setOnestopId(operator) {
			var onestopId = operator.id;
			this.set('onestop_id', onestopId);
			this.set('selectedOperator', operator);
		},
		selectOperator(operator){
			this.set('selectedOperator', null);
			operator.set('operator_path_opacity', 1);
			operator.set('operator_path_weight', 3);
			this.set('hoverOperator', operator);
		},
		unselectOperator(operator){
			operator.set('operator_path_opacity', 0.5);
			operator.set('operator_path_weight', 1.5);
			this.set('hoverOperator', null);
		}
	}
});
