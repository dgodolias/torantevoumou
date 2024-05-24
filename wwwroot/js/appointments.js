$(document).ready(function() {
    $('#serviceSelect').change(function() {
        var selectedService = $(this).val();
        if (selectedService) {
            // Make an AJAX request to the server with the selected service
            $.ajax({
                url: '/api/SetSelectedService',
                type: 'POST',
                headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
                contentType: 'application/json',
                data: JSON.stringify(selectedService),
                success: function(response) {
                    if (response.success) {
                        $('#selectedService').val(selectedService);
                        $('#datepickerappointments').show();
                    }
                }
            });
            console.log(selectedService);
        } else {
            $('#datepickerappointments').hide();
        }
    });
});
