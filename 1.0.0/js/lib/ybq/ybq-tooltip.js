///////////////////////////////////////////////////////////////////
//
// Youbiquitous Web Assets
// Copyright (c) Youbiquitous 2022
//
// Author: Youbiquitous Team
// v2.0.0  (April 22, 2022)
//

$(document).ready(function (e) {
    $('tooltip').parent().each(function (e) {
        $(this).css({ 'overflow': 'unset', 'position': 'relative', 'transition': 'all .3s' });
    });
});



$('tooltip').parent().hover(function (e) {
    var content = $(this).find('tooltip').text();
    if (content.length > 0) {
        let parents = $(this).parents();
        let parentZoomValue = null;
        
        parents.each(function (e) {  
            if ($(this).css('zoom') != 1 && $(this).css('zoom') != null) 
                parentZoomValue = $(this).css('zoom');
        });

        //console.log(parentZoomValue);
        if (parentZoomValue != null) {
            /*if (parentZoomValue < 1) */
                $(this).find('tooltip').css({ 'display': 'block', 'zoom': (1.0 / parentZoomValue) });
            //else 
            //    $(this).find('tooltip').css({ 'display': 'block', 'zoom': (1.0 / parentZoomValue) });
        } else {
            $(this).find('tooltip').css({ 'display': 'block' });
        }
    }
});

$('tooltip').parent().mouseleave(function (e) {
    $(this).find('tooltip').css({'display':'none'});
});