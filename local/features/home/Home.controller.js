sap.ui.define([
    "edu/mit/voip-portal/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/voip-portal/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.voip-portal.features.home.Home", {       
        /* =========================================================== */
        /* lifecycle methods                                         */
        /* =========================================================== */
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); 
            this.getRouter().getRoute("home").attachMatched(this._onRouteMatched, this); 
            //create view model to manage state
            this.viewModel = new JSONModel({});
            this.getView().setModel(this.viewModel);
        },
        onBeforeRendering: function () {

        },
        onAfterRendering: function () {
            
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */

        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
       

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * Called everytime view is navigated to
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {

        },



    });
});