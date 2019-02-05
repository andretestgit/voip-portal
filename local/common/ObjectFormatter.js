sap.ui.define([], function () {
    "use strict";
    $.sap.getObject("edu.mit.parking.formatter", 0);
    edu.mit.parking.formatter = {
        getName: function (value) {
            var sPath = this.getBindingContext("sessionData").sPath;
            var oEntry = this.oModel.getProperty(sPath);
        }
    };
});