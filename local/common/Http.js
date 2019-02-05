sap.ui.define([], function () {
    "use strict";

    var Http = function () {};

    var CONTENT_TYPE_UPLOAD = "binary/octet-stream";
    var CONTENT_TYPE_JSON = "application/json";

    // We cannot do any HTTP mutating requests unless we have a CSRF token
    var loadCsrfToken = function (doneCallback) {
        var CSRF_SESSION_TOKEN = null;
        jQuery.ajax({
            method: "GET",
            url: URL_CSRF_API,
            success: function (response, textStatus, jqXHR) {
                if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                    return;
                }
                CSRF_SESSION_TOKEN = response;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == "403" || jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                    return;
                }
                console.error("Exception loading CSRF token.");
            },
            complete: function () {
                if (CSRF_SESSION_TOKEN == null) {
                    CSRF_SESSION_TOKEN = "TOKEN NOT SET";
                    console.log("CSRF token was not set.");
                }

                if (doneCallback) {
                    doneCallback(CSRF_SESSION_TOKEN);
                }
            }
        });
    };

    var buildSuccessFn = function (context, successCallback, transformFn) {
        return function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                return;
            }

            // Call success callback if defined, preceded with a transform callback if defined
            if (successCallback) {
                if (transformFn) {
                    res = transformFn.call(context, res, textStatus, jqXHR);
                }

                successCallback.call(context, res, textStatus, jqXHR);
            }
        };
    };

    var buildErrorFn = function (context, errorCallback) {
        return function (jqXHR, textStatus, errorThrown) {
            // Skipping these will be handled by code in session
            if (jqXHR.status === "403" || jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                return;
            }

            // Call error callback if defined
            if (errorCallback) {
                var c = 0;
                var messages = null;

                // Process json responses
                try {
                    var json = JSON.parse(jqXHR.responseText);

                    // A single message returned
                    if (json.message) {
                        messages = [json.message];
                    }


                    // More than one string messages returned
                    else if (json.messages !== undefined && json.messages.length && (typeof json.messages[0]) === "string") {
                        messages = [];
                        for (c = 0; c < json.messages.length; c++) {
                            messages.push(json.messages[c]);
                        }
                    }
                    // More than one SAP messages returned
                    else if (json.messages !== undefined && json.messages.length && (typeof json.messages[0]) === "object") {
                        messages = [];
                        for (c = 0; c < json.messages.length; c++) {
                            messages.push(json.messages[c].text);
                        }
                    }
                } catch (error) {}

                // If the error is not returned by json structure use the jquery and http text
                if (messages === null) {
                    messages = [];

                    // Possible values may be "timeout", "error", "abort", and "parsererror".
                    if (textStatus) {
                        messages.push(textStatus);
                    } else if (errorThrown) {
                        messages.push(errorThrown);
                    }
                }

                messages.push("Please contact mitparking@mit.edu for further assistance");
                errorCallback.call(context, messages, jqXHR);
            }
        };
    };

    var defaultOptions = function (context) {
        return {
            headers: {},
            async: false,
            success: function (res, textStatus, jqXHR) {},
            transform: null,
            error: function (jqXHR, textStatus, errorThrown) {}
        };
    };

    var localOptions = function (url, opts) {
        if (!opts.headers) {
            opts.headers = {};
        }
        if (APP_BUILD_NUMBER === "local") {
            opts.headers['Authorization'] = APP_LOCAL_AUTH['Authorization'];
            opts.headers['X-Referred-User'] = APP_LOCAL_AUTH['X-Referred-User'];
            if (url.indexOf("pk_finance") >= 0) {
                opts.url = "https://mit-finance-v2-dev.cloudhub.io/api" + url.replace("/apis/mulesoft/pk_finance", "");
            } else {
                if (url.indexOf("/apis/mulesoft/pk_parking/api") >= 0) {
                    opts.url = "https://mit-parking-v1-dev.cloudhub.io/api" + url.replace("/apis/mulesoft/pk_parking/api", "");
                } else {
                    opts.url = "https://mit-parking-v1-dev.cloudhub.io/api" + url.replace("/apis/mulesoft/pk_parking", "");
                }
                // if (url.indexOf("/apis/mulesoft/pk_parking/api") >= 0) {
                //     opts.url = "https://localhost:8082/api" + url.replace("/apis/mulesoft/pk_parking/api", "");
                // } else {
                //     opts.url = "https://localhost:8082/api" + url.replace("/apis/mulesoft/pk_parking", "");
                // }
            }
        } else {
            opts.url = url;
        }
        return opts;
    };

    var postOptions = function (opts, data) {
        var postOptions = {
            processData: false, // Otherwise data is converted into a query string using jQuery.param() before it is sent.
            contentType: opts.contentType || CONTENT_TYPE_JSON
        };
        if (postOptions.contentType == CONTENT_TYPE_JSON) {
            postOptions.data = JSON.stringify(data);
        } else if (postOptions.contentType == CONTENT_TYPE_UPLOAD) {
            postOptions.data = data;
        } else {
            throw "Content Type [" + opts.contentType + "] not implemented.";
        }
        return postOptions;
    };

    Http.prototype.get = function (url, opts, context) {
        opts = localOptions(url, opts || defaultOptions(context));
        jQuery.ajax({
            method: "GET",
            url: opts.url,
            headers: opts.headers,
            async: opts.async,
            success: buildSuccessFn(context, opts.success, opts.transform),
            error: buildErrorFn(context, opts.error)
        });
    };

    Http.prototype.post = function (url, data, opts, context) {
        opts = localOptions(url, opts || defaultOptions(context));
        var postOpts = postOptions(opts, data);
        loadCsrfToken(function (csrfToken) {
            opts.headers['X-CSRF-Token'] = csrfToken;
            jQuery.ajax({
                method: "POST",
                url: opts.url,
                headers: opts.headers,
                async: opts.async,
                processData: postOpts.processData,
                contentType: postOpts.contentType,
                data: postOpts.data,
                success: buildSuccessFn(context, opts.success, opts.transform),
                error: buildErrorFn(context, opts.error)
            });
        });
    };

    Http.prototype.put = function (url, data, opts, context) {
        opts = localOptions(url, opts || defaultOptions(context));
        var postOpts = postOptions(opts, data);
        loadCsrfToken(function (csrfToken) {
            opts.headers['X-CSRF-Token'] = csrfToken;
            jQuery.ajax({
                method: "PUT",
                url: opts.url,
                headers: opts.headers,
                async: opts.async,
                processData: postOpts.processData,
                contentType: postOpts.contentType,
                data: postOpts.data,
                success: buildSuccessFn(context, opts.success, opts.transform),
                error: buildErrorFn(context, opts.error)
            });
        });
    };

    Http.prototype.delete = function (url, opts, context) {
        opts = localOptions(url, opts || defaultOptions(context));
        loadCsrfToken(function (csrfToken) {
            opts.headers['X-CSRF-Token'] = csrfToken;
            jQuery.ajax({
                method: "DELETE",
                url: opts.url,
                headers: opts.headers,
                async: opts.async,
                dataType: "text", // The type of data we are expecting from the server, for DELETE we expect empty response.
                success: buildSuccessFn(context, opts.success, opts.transform),
                error: buildErrorFn(context, opts.error)
            });
        });
    };

    return new Http();
});