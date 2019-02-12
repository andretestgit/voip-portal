sap.ui.define([
	"edu/mit/voip-portal/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/voip-portal/common/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("edu.mit.voip-portal.features.dashboard.Dashboard", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/
			/* Andre Test Model */

			var oMyAccounts = new JSONModel();
			this.getView().setModel(oMyAccounts, "myaccounts");

			//	this._loadFlights();

			var aData = [{
				"acct_name": "My Office",
				"acct_phonenumber": "617-253-0011",
				"acct_username": "Jonathan Williams",
				"acct_callerid": "Jon Williams",
				"acct_vmenabled": "Voicemail Enabled",
				"acct_forwardedto": "617-253-4422",
				"acct_forwardedto_enabled": false,
				"acct_devices": [{
					device: "Polycom VVX600",
					description: "W92-111"
				}, {
					device: "Polycom 450",
					description: "Lab Phone"
				}]

			}, {
				"acct_name": "Help Desk",
				"acct_phonenumber": "617-253-0478",
				"acct_username": "Multiple Owners",
				"acct_callerid": "IS&T Help Desk",
				"acct_vmenabled": "Voicemail Enabled",
				"acct_forwardedto": "617-253-4422",
				"acct_forwardedto_enabled": false,
				"acct_devices": [{
					device: "Polycom VVX600",
					description: "W92-111"
				}, {
					device: "Polycom VVX600 ONE",
					description: "W92-111 ONE"
				}]

			}];
			oMyAccounts.setData(aData);

			this.getRouter().getRoute("dashboard").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			/*Andre
						//create local json model for view for test data
						var oModel = new JSONModel({
							canRemoveVehicles: false,
							outstandingBalance: 0,
							outstandingTickets: 1,
							billing: {
								statements: []
							},
							tickets: [

							]
						});
						this.getView().setModel(oModel);
						this.viewModel = oModel;
			Andre*/
		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {
			/* Andre
			this._setHeaderButtonSelected();
			*/
			//simulate reading data from API for billing statements
			/*Andre
			this._getModel("sessionData").setProperty("/billing/statements", [{
				periodStartDate: "02152018",
				periodEndDate: "03142018",
				amount: 40,
				dueDate: "04302018",
				autoDeductionDates: [
					"04152018", "04302018"
				],
				deductionType: "payroll"
			}, {
				periodStartDate: "03152018",
				periodEndDate: "04142018",
				amount: 300,
				dueDate: "05302018",
				autoDeductionDates: [{
					date: "05152018"
				}, {
					date: "05302018"
				}],
				deductionType: "payroll"
			}]);
			*/
		},
		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */
		/*
				createTicketCounts: function (sId, oContext) {
					var sState = oContext.oModel.getProperty(oContext.sPath).state;
					var oListItem = new sap.m.CustomListItem({
						content: new sap.m.HBox({
							justifyContent: "SpaceBetween",
							items: [
								new sap.m.Text().bindProperty("text", {
									path: 'sessionData>state',
									formatter: this.formatter.getTicketCountText.bind(this)
								}).addStyleClass("ticket-text"),
								new sap.m.Text({
									text: "{sessionData>count}",
									wrapping: false
								}).addStyleClass("billAmount ticket-text")
							]
						})
					}).addStyleClass("listItem ticket-no-border")
					if (sState === "ISSUED") {
						oListItem.addStyleClass("ticket-issued");
					} else {
						oListItem.addStyleClass("ticket-appealed");
					}

					return oListItem;
				},
		*/
		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */

		/**
		 * Navigate to ticket history details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressTicketHistory: function (oEvent) {
			this.getRouter().navTo("violationHistory");
		},
		/**
		 * Navigate to account history details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressTransactionHistory: function (oEvent) {
			this.getRouter().navTo("accountHistory");
			//add parameters to pass flag for open tickets
		},
		/**
		 * Navigate to permit details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressPermitDetails: function (oEvent) {
			this.getRouter().navTo("permitDetails", {
				sPath: oEvent.getSource().getBindingContext("sessionData").sPath.split("/")[2] //send index of permit,
			});
		},
		/**
		 * Mark banner message as seen so it will not show up next time user launched application and remove it from the model
		 * @param {sap.ui.base.Event} oEvent : Icon Press
		 * @public
		 */
		onPressDeleteBannerMessage: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath,
				iIndex = sPath.split("/")[2],
				oBanners = this._getModel("sessionData").getProperty(sPath.split(iIndex)[0]);
			//make http call to remove flag banner as removed based on ID
			oBanners.splice(iIndex, 1);
			this._getModel("sessionData").setProperty(sPath.split(iIndex)[0], oBanners);
		},

		/* =========================================================== */
		/* coordinator event methods                                    */
		/* =========================================================== */

		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function (oEvent) {
			this._setHeaderButtonSelected();
		}

	});
});