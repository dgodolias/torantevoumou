$(document).ready(function() {
    // Initialize the datepicker
    $('#datepicker').datepicker({
        minDate: 0,
        onSelect: function(dateText, inst) {
            console.log('You selected: ' + dateText);
        }
    });
    var viewportHeight = $(window).height();
    var dialogHeight = viewportHeight * 0.8; // 80% of the viewport height
    // Initialize the dialog
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        width: '80%',
        height: dialogHeight,
        draggable: false,
        resizable: false,
        modal: false,
        show: {
            effect: 'fade',
            duration: 1000
        },
        hide: {
            effect: 'fade',
            duration: 1000
        },
        open: function() {
            // Show the overlay with the blur effect when the dialog is opened
            $('#blurOverlay').fadeIn(1000);
        },
        beforeClose: function() {
            // Hide the overlay when the dialog is closed
            $('#blurOverlay').fadeOut(1000);
        }
    });

    $('#serviceList .serviceItem').on('click', function() {
        var serviceName = $(this).attr('id');
        console.log('You clicked on service: ' + serviceName);
        // Open the dialog
        $('#dialog').dialog('open');
    });
});


