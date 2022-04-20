/// <reference path="~/js/lib/jquery.min.js" />
/// <reference path="~/js/lib/typeahead.bundle.min.js" />
/// <reference path="~/js/lib/jquery-confirm.min.js" />


///////////////////////////////////////////////////////////////////
//
// Youbiquitous YBQ : app starter 
// Copyright (c) Youbiquitous srl 2020
//
// Author: Youbiquitous Team
// 

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

// **************************************************************************************************//

// <summary>
// Root object for any script function used throughout the application
// </summary>
var Ybq = Ybq || {};
Ybq.Internal = {};
Ybq.RootServer = "";        // Should be set to /vdir when deployed


// <summary>
// Return a root-based path
// </summary>
Ybq.fromServer = function (relativeUrl) {
    return Ybq.RootServer + relativeUrl;
};

// <summary>
// Helper function to call a remote URL (GET)
// </summary>
Ybq.invoke = function (url, success, error) {
    $.ajax({
        cache: false,
        url: Ybq.fromServer(url),
        success: success,
        error: error
    });
};

// <summary>
// Jump to the given ABSOLUTE URL (no transformation made on the URL)
// </summary>
Ybq.goto = function(url) {
    window.location = url;
};

// <summary>
// Jump to the given RELATIVE URL (modified with ROOTSERVER)
// </summary>
Ybq.gotoRelative = function(url) {
    window.location = Ybq.fromServer(url);
};

// <summary>
// Helper function to call a remote URL (POST)
// </summary>
Ybq.post = function (url, data, success, error) {
    var defer = $.Deferred();
    $.ajax({
        cache: false,
        url: Ybq.fromServer(url),
        type: 'post',
        data: data,
        success: success,
        error: error
    });
    defer.resolve("true");
    return defer.promise();
};

// <summary>
// WRAPPER for common operations on Twitter TypeAhead
// </summary>
var TypeAheadContainerSettings = function() {
    var that = {};
    that.postOnSelection = false;
    that.displayKey = 'value';
    that.hintUrl = '';
    that.targetSelector = '';
    that.buddySelector = '';
    that.submitSelector = '';
    that.showHint = true;
    that.maxNumberOfHints = 10;
    that.highlight = true;
    that.showLabel = true;
    that.action = function () {};
    return that;
};

var TypeAheadContainer = function(options) {
    var settings = new TypeAheadContainerSettings();
    jQuery.extend(settings, options);

    // Set up the default Bloodhound hint adapter
    this.hintAdapter = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace(settings.displayKey),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: settings.maxNumberOfHints,
        remote: settings.hintUrl
    });

    // Register handlers
    $(settings.targetSelector).on('typeahead:selected',
        function(e, datum) {
            $(settings.targetSelector).attr("data-itemselected", 1);
            $(settings.buddySelector).val(datum.id);

            // Post on selection
            if (settings.postOnSelection) {
                $(settings.submitSelector).click();
            }

            // Call custom action
            if (settings.action != null) {
                (settings.action)(datum.id);
            }
        });
    $(settings.targetSelector).on('blur',
        function() {
            var typeaheadItemSelected = $(settings.targetSelector).attr("data-itemselected");
            if (typeaheadItemSelected !== "1") {
                $(settings.targetSelector).val("");
                $(settings.buddySelector).val("");
            }
        });
    $(settings.targetSelector).on('input',
        function() {
            var typeaheadItemSelected = $(settings.targetSelector).attr("data-itemselected");
            if (typeaheadItemSelected === "1") {
                $(settings.targetSelector).attr("data-itemselected", 0);
                $(settings.buddySelector).val('');
                $(settings.targetSelector).val('');
            }
        });

    // Initializer
    this.attach = function() {
        this.hintAdapter.initialize();
        $(settings.targetSelector).typeahead(
            {
                hint: settings.showHint,
                highlight: settings.highlight,
                limit: settings.maxNumberOfHints,
                autoSelect: false
            },
            {
                displayKey: settings.displayKey,
                source: this.hintAdapter.ttAdapter(),
                templates: {
                    suggestion: function (data) {
                        var label = settings.showLabel
                            ? "<i class='pull-right'>" + (data.label == null ? "" : data.label) + "</i>"
                            : "";
                        return "<p><span>" + data.value + "</span>" + label + "</p>";
                    }
                }
            }
        );
    };
};