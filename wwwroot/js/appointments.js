var globalAppointments = [];

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

                        // Make a GET request to get the list of service appointments
                        $.ajax({
                            url: '/api/GetServiceAppointments/' + selectedService,
                            type: 'GET',
                            success: function(appointments) {
                                // Store appointments in the global variable
                                globalAppointments = appointments;

                                // Print each appointment
                                appointments.forEach(function(appointment) {
                                    console.log("Appointment: ", appointment);
                                });
                            },
                            error: function(error) {
                                console.error("Error getting appointments: ", error);
                            }
                        });
                    }
                }
            });
            console.log(selectedService);
        } else {
            $('#datepickerappointments').hide();
        }
    });
});
