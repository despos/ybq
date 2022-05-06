///////////////////////////////////////////////////////////////////
//
// Youbiquitous Web Assets
// Copyright (c) Youbiquitous 2022
//
// Author: Youbiquitous Team
// v2.0.0  (April 22, 2022)
//

var __AppName = "MESSAGE";

// <summary>
// Display a modal message to dismiss (uses jquery.confirm.min.js)
// </summary>
Ybq.alert = function (message, success, partial, ms) {
    var done = "<i class='fa fa-check text-success me-2'></i>";
    var fail = "<i class='far fa-times-circle text-danger me-2'></i>";
    var warn = "<i class='fa fa-exclamation-triangle text-warning me-2'></i>";

    var titleText = "";
    var msgTokens = message.split('|');
    if (msgTokens.length > 1) {
        titleText = msgTokens[0];
        message = msgTokens[1];
    } else {
        titleText = __AppName;
    }

    var title = done + titleText;
    var type = "green";
    if (success) {
        if (partial) {
            title = warn + titleText;
            type = "orange";
        }
    } else {
        title = fail + titleText;
        type = "red";
    }

    // How long to wait
    var autoClose = "|5000";
    var timer = parseInt(ms);
    if (!isNaN(timer)) {
        autoClose = "|" + timer;
        if (timer <= 0) {
            autoClose = "";
        }
    } 

    var defer = $.Deferred();
    $.confirm({
        keyboardEnabled: true,
        title: title,
        type: type,
        content: message,
        //autoClose: "ok|5000",
        autoClose: "ok" + autoClose,
        buttons: {
            ok: {
                keys: ['Enter'],
                text: "<i class='fa fa-check'></i>",
                action: function() {
                    defer.resolve("true");
                }
            }
        }
    });
    return defer.promise();
};

// <summary>
// Display a modal message to dismiss (uses jquery.confirm.min.js)
// </summary>
Ybq.confirm = function (message, tone, ms) {
    var titleText = "";
    var msgTokens = message.split('|');
    if (msgTokens.length > 1) {
        titleText = msgTokens[0];
        message = msgTokens[1];
    } else {
        titleText = __AppName;
    }

    var icon = "<i class='fa fa-question-circle text-primary mr-2'></i>";
    var title = icon + titleText;
    var yesStyle = "btn-primary";
    if (tone === "red") {
        yesStyle = "btn-danger";
    } else if (tone === "success") {
        yesStyle = "btn-success";
    }

    // How long to wait
    var autoClose = "|5000";
    var timer = parseInt(ms);
    if (!isNaN(timer)) {
        autoClose = "|" + timer;
        if (timer <= 0) {
            autoClose = "";
        }
    }

    var defer = $.Deferred();
    $.confirm({
        keyboardEnabled: true,
        title: title,
        type: tone,
        columnClass: 'col-6',
        content: message,
        autoClose: "ok" + autoClose,
        buttons: {
            ok: {
                keys: ['Enter'],
                text: "<i class='fa fa-2x fa-check'></i>",
                btnClass: yesStyle,
                action: function () {
                    defer.resolve("true");
                }
            },
            cancel: {
                text: "<i class='fa fa-2x fa-times'></i>",
                action: function () {
                    defer.reject();
                }
            }
        }
    });
    return defer.promise();
};

