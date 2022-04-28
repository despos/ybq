///////////////////////////////////////////////////////////////////
//
// Youbiquitous Web Assets
// Copyright (c) Youbiquitous 2022
//
// Author: Youbiquitous Team
// v2.0.0  (April 22, 2022)
//


// <summary>
// Adds automatic URL navigation to hovered tables (TR having a data-url attribute)
// </summary>
Ybq.selectableTable = function() {
    $(".table-hover tbody tr td").click(function() {
        var attr = $(this).attr("data-noselect");
        if (typeof attr !== typeof undefined && attr !== false) {
            return;
        }
        var tr = $(this).closest("tr");
        var url = tr.data("url");
        if (url.length > 0)
            Ybq.gotoRelative(url);
    });
};

// <summary>
// Adds automatic clicking logic to hovered tables  
// </summary>
Ybq.selectableTableFunc = function (handler) {
    $(".table-hover tbody tr td").click(function() {
        var attr = $(this).attr("data-noselect");
        if (typeof attr !== typeof undefined && attr !== false) {
            return;
        }
        var tr = $(this).closest("tr");
        if (typeof handler !== typeof undefined && handler !== false) {
            handler(tr);
        }
    });
};

// <summary>
// Adds automatic clicking logic to DIV.row > DIV.selectable
// </summary>
Ybq.selectableDiv = function(handler) {
    $("div.row > div.selectable").click(function() {
        var row = $(this).closest("div.row");
        if (typeof handler !== typeof undefined && handler !== false) {
            handler(row);
        }
    });

    $("div.row[data-hover]").hover(function() {
            var css = $(this).data("hover");
            if (css.length === 0) {
                css = "bg-light";
            }
            $(this).addClass(css);
        },
        function() {
            var css = $(this).data("hover");
            if (css.length === 0) {
                css = "bg-light";
            }
            $(this).removeClass(css);
        });
};

// **************************************************************************************************//

// <summary>
// WRAPPER for pagination operations
// </summary>
var PaginatorSettings = function() {
    var that = {};
    that.pagingUrl = "";
    that.pageIndex = 1;
    that.gridSelector = "";
    that.loaderSelector = "";
    that.updateHash = false;
    that.useAjaxCache = false;
    that.sessionStorageId = "";
    that.gridInitializer = function() {};
    return that;
};

var PaginatorContainer = function (options) {
    var settings = new PaginatorSettings();
    jQuery.extend(settings, options);

    // Initializer
    this.go = function(index, filter, sortby) {
        if (typeof index === "undefined") {
            var lastIndexInLocalStorage = window.sessionStorage[settings.sessionStorageId];
            if (typeof lastIndexInLocalStorage === "undefined") {
                index = 1;
            } else {
                index = parseInt(lastIndexInLocalStorage);
            }
        }
        if (typeof filter === "undefined") {           
            var lastFilterInLocalStorage = window.sessionStorage[settings.sessionStorageId + "-filter"];
            if (typeof lastFilterInLocalStorage === "undefined") {
                filter = "";
            } else {
                filter = lastFilterInLocalStorage;
            }
        }
        if (typeof sortby === "undefined") {
            var lastSortbyInLocalStorage = window.sessionStorage[settings.sessionStorageId + "-sortby"];
            if (typeof lastSortbyInLocalStorage === "undefined") {
                sortby = "";
            } else {
                sortby = lastSortbyInLocalStorage;
            }
        }

        // Turn on the loader GIF
        $(settings.loaderSelector).show();

        // Prepare the URL to get the HTML for the current page
        // Assumes p=?&q=?&o=? 
        var actualUrl = settings.pagingUrl + "?p=" + index;
        if (filter !== null && filter.length > 0)
            actualUrl += "&q=" + filter;
        if (sortby !== null && sortby.length > 0)
            actualUrl += "&o=" + sortby;

        $.ajax({ url: actualUrl, cache: settings.useAjaxCache })
            .done(function(response) {
                // Turn off the loader GIF
                $(settings.loaderSelector).hide();
                // Change the current window hash
                if (settings.updateHash)
                    window.location.hash = index;
                // Save current page to local-storage 
                if (settings.sessionStorageId.length > 0) {
                    window.sessionStorage[settings.sessionStorageId] = index;
                    window.sessionStorage[settings.sessionStorageId + "-filter"] = filter;
                    window.sessionStorage[settings.sessionStorageId + "-sortby"] = sortby;
                }
                // Refresh the view
                $(settings.gridSelector).html(response);
                // Initialize the grid
                settings.gridInitializer();
            });
    };
};

Ybq.pager = function (id, url, index, filter, sortby) {
    var idSelector = "#" + id;
    new PaginatorContainer({
        pagingUrl: url,  
        gridSelector: idSelector,  
        loaderSelector: idSelector + "-loader",
        sessionStorageId: id
    }).go(index, filter, sortby);
};

// **************************************************************************************************//

// <summary>
// ADAPTER for paging tables
// </summary>
$(document).ready(function () {

    $(".ybq-page-table").each(function () {
        var id = $(this).attr("id");
        var url = $(this).data("url");
        Ybq.pager(id, url);
    });

});
