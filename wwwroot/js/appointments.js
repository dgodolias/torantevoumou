$(document).ready(function() {
    // Initialize the dialog
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        width: '80%',
        height: '80%',
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
