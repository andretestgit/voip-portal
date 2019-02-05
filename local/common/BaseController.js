sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("edu.mit.voip-portal.common.BaseController", {

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */
		/**
		 * Returns translated text based on key
		 * @param {string} sKey : Key for translated text
		 * @param {array} aParameters : array of parameters 
		 * @public
		 */
		getTranslation: function (sKey, aParameters) {
			return this._getModel("i18n").getResourceBundle().getText(sKey, aParameters);
		},

		/**
		 * Removes error state from input
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		removeValidationError: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},	
		
		/* =========================================================== */
		/* Routing methods                                         */
		/* =========================================================== */

		/**Returns reference to router object
		 * @public
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Navigates back to previous page in history. If history is empty, navigates back to first page
		 * @public
		 */
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("dashboard", {}, true /* no history */ );
			}
		},
		
		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Convenience method for getting the view model by name
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 * @private
		 */
		_getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		}	

	});
});