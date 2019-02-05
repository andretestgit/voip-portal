sap.ui.define([
	"edu/mit/voip-portal/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/voip-portal/common/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";
	return BaseController.extend("edu.mit.voip-portal.features.dashboardaa.Dashboardaa", {
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); /*this.getRouter().getRoute("home").attachMatched(this._onRouteMatched, this);*/
			//create view model to manage state

			this.getRouter().getRoute("dashboardaa").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to

			this.viewModel = new JSONModel({});
			this.getView().setModel(this.viewModel, "flights");

			this._loadFlights();
			/*	
				var oMessages = new JSONModel();
				this.getView().setModel(oMessages, "messages");
			*/
		},
		onBeforeRendering: function () {},
		onAfterRendering: function () {},
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
		_onRouteMatched: function (oEvent) {},
		/**
		 *@memberOf edu.mit.voip-portal.features.dashboardaa.Dashboardaa
		 */
		_loadFlights: function () {
			var oView = this.getView();
			oView.setBusy(true);

			var self = this;

			//	var channel = "YOUR_CHANNEL_ID";
			//	var token = "YOUR_TOKEN";

			$.ajax({
					type: 'GET',
					url: "/api/flights",
					async: false
				}).done(function (results) {
					console.log(results);
					self.getView().getModel("flights").setProperty("/data", results.flights);
					oView.setBusy(false);
				})
				.fail(function (err) {
					oView.setBusy(false);
					if (err !== undefined) {
						var oErrorResponse = $.parseJSON(err.responseText);
						sap.m.MessageToast.show(oErrorResponse.message, {
							duration: 6000
						});
					} else {
						sap.m.MessageToast.show("Unknown error!");
					}
				});

		},
		onButtonAA: function (oEvent) {
			//This code was generated by the layout editor.
		},
		/**
		 *@memberOf edu.mit.voip-portal.features.dashboardaa.Dashboardaa
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});