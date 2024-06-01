$(document).ready(function() {
    // Initialize the dialog
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        open: function() {
            // Fade the appointments page when the dialog is opened
            $('#appointmentsPage').fadeTo('slow', 0.5);
        },
        close: function() {
            // Restore the opacity of the appointments page when the dialog is closed
            $('#appointmentsPage').fadeTo('slow', 1);
        }
    });

    $('#serviceList .serviceItem').on('click', function() {
        var serviceName = $(this).attr('id');
        console.log('You clicked on service: ' + serviceName);
        // Open the dialog
        $('#dialog').dialog('open');
    });
});
