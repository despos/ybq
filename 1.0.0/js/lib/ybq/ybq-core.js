
///////////////////////////////////////////////////////////////////
//
// Youbiquitous YBQ : app starter 
// Copyright (c) Youbiquitous srl 2020
//
// Author: Dino Esposito (http://youbiquitous.net)
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
                            ? "<i class='float-end'>" + (data.label == null ? "" : data.label) + "</i>"
                            : "";
                        return "<p><span>" + data.value + "</span>" + label + "</p>";
                    }
                }
            }
        );
    };
};


// <summary>
// Custom plugins for (animated) messages in UI
// </summary>
(function($) {
    // Add a rotating spin to the element
    $.fn.spin = function() {
        var fa = "<i class='ybq-spin ms-1 ml-1 fas fa-spinner fa-pulse'></i>";
        $(this).append(fa);
        return $(this);
    }

    // Remove a rotating spin from the element
    $.fn.unspin = function() {
        $(this).find("i.ybq-spin").remove();
        return $(this);
    }

    // Add a cleaning timer for the HTML content of the element
    $.fn.hideAfter = function(secs) {
        secs = (typeof secs !== 'undefined') ? secs : 3;
        var item = $(this);
        window.setTimeout(function () {
            $(item).html("");
        }, secs * 1000);
        return $(this);
    }

    // Add a reload timer for the current page
    $.fn.reloadAfter = function(secs) {
        secs = (typeof secs !== 'undefined') ? secs : 3;
        var item = $(this);
        window.setTimeout(function () {
            window.location.reload();
        }, secs * 1000);
        return $(this);
    }

    // Add a goto timer to navigate away
    $.fn.gotoAfter = function(url, secs) {
        secs = (typeof secs !== 'undefined') ? secs : 3;
        var item = $(this);
        window.setTimeout(function () {
            window.location.href = url;
        }, secs * 1000);
        return $(this);
    }

    // HTML writer context-sensitive
    $.fn.setMsg = function(text, success) {
        var css = success ? "text-success" : "text-danger";
        $(this).html(text).removeClass("text-success text-danger").addClass(css);
        return $(this);
    }

    // HTML writer (error message) 
    $.fn.fail = function(text) {
        return $(this).setMsg(text, false);
    }

    // Show/Hide via d-none (mostly for form overlays)
    $.fn.overlayOn = function() {
        return $(this).removeClass("d-none");
    }
    $.fn.overlayOff = function() {
        return $(this).addClass("d-none");
    }

    // Remove d-none
    $.fn.visible = function() {
        return $(this).removeClass("d-none");
    }

    // Add a d-none hiding timer for the element
    $.fn.invisibleAfter = function(secs) {
        secs = (typeof secs !== 'undefined') ? secs : 3;
        var item = $(this);
        window.setTimeout(function () {
            $(item).addClass("d-none"); 
        }, secs * 1000);
        return $(this);
    }

}(jQuery));