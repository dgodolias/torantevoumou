function initializeDatepicker(selector, callback) {
    $(selector).datepicker({
        inline: true,
        onSelect: function(dateText) {
            var date = new Date(dateText);
            callback(date);
        }
    });
}

$(function() {
    initializeDatepicker("#datepickerForAdmin", fetchUsersForAdmin);
    initializeDatepicker("#datepickerMyprofile", createSampleTable);
});

function createSampleTable() {
    var selectedDate = moment(date, "MM/DD/YYYY"); // Parse the selected date with moment.js

    // Create a table
    var html = "<table style='border-collapse: collapse; width: 100%;'><thead><tr><th style='border: 1px solid black; padding: 5px;'>Time</th><th style='border: 1px solid black; padding: 5px;'>Id</th><th style='border: 1px solid black; padding: 5px;'>First Name</th><th style='border: 1px solid black; padding: 5px;'>Last Name</th><th style='border: 1px solid black; padding: 5px;'>Username</th><th style='border: 1px solid black; padding: 5px;'>Email</th><th style='border: 1px solid black; padding: 5px;'>Phone Number</th></tr></thead><tbody>";

    // Loop through each 30-minute period from 9 AM to 9 PM
    for (var i = 9; i <= 21; i += 0.5) {
        var time = moment({hour: Math.floor(i), minute: (i % 1) * 60}).format("HH:mm");
    }

    html += "</tbody></table>"; // Close the table

    $("#appointments").html(html);
}

$( "#datepickerMyProfile" ).datepicker({
    onSelect: function(dateText) {
        createSampleTable();
    }
});

function fetchUsersForAdmin(date) {
    var selectedDate = moment(date, "MM/DD/YYYY"); // Parse the selected date with moment.js

    // Create a table
    var html = "<table style='border-collapse: collapse; width: 100%;'><thead><tr><th style='border: 1px solid black; padding: 5px;'>Time</th><th style='border: 1px solid black; padding: 5px;'>Id</th><th style='border: 1px solid black; padding: 5px;'>First Name</th><th style='border: 1px solid black; padding: 5px;'>Last Name</th><th style='border: 1px solid black; padding: 5px;'>Username</th><th style='border: 1px solid black; padding: 5px;'>Email</th><th style='border: 1px solid black; padding: 5px;'>Phone Number</th></tr></thead><tbody>";

    // Loop through each 30-minute period from 9 AM to 9 PM
    for (var i = 9; i <= 21; i += 0.5) {
        var time = moment({hour: Math.floor(i), minute: (i % 1) * 60}).format("HH:mm");

        // Find the client for the current time period
        var client = clients.find(function(client) {
            var appointmentDates = client.appointmentDate.split('#'); // Split the appointment dates into an array
            var appointmentTimes = client.appointmentTime.split('#'); // Split the appointment times into an array

            // Check if the appointment date is the same as the selected date and the appointment time is the same as the current time
            for (var j = 0; j < appointmentDates.length; j++) {
                var appointmentDate = moment(appointmentDates[j]); // Parse the appointment date with moment.js
                var appointmentTime = moment(appointmentTimes[j], "HH:mm").format("HH:mm"); // Parse the appointment time with moment.js

                if (appointmentDate.isSame(selectedDate, 'day') && appointmentTime === time) {
                    return true;
                }
            }

            return false;
        });

        // Add a row to the table for the current time period
        if (client) {
            console.log(client);
            html += "<tr><td style='border: 1px solid black; padding: 5px;'>" + time + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.id + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.firstName + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.lastName + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.username + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.email + "</td><td style='border: 1px solid black; padding: 5px;'>" + client.phoneNumber + "</td></tr>";
        } else {
            html += "<tr><td style='border: 1px solid black; padding: 5px;'>" + time + "</td><td style='border: 1px solid black; padding: 5px;' colspan='6'></td></tr>";
        }
    }

    html += "</tbody></table>"; // Close the table

    $("#matchingClients").html(html);
}

function fetchUsersMyprofile(date) {
    var selectedDate = moment(date, "MM/DD/YYYY"); // Parse the selected date with moment.js

    // Create a table
    var html = "<table style='border-collapse: collapse; width: 100%;'><thead><tr><th style='border: 1px solid black; padding: 5px;'>Time</th><th style='border: 1px solid black; padding: 5px;'>Appointment Status</th></tr></thead><tbody>";

    // Loop through each 30-minute period from 9 AM to 9 PM
    for (var i = 9; i <= 21; i += 0.5) {
        var time = moment({hour: Math.floor(i), minute: (i % 1) * 60}).format("HH:mm");

        // Check if an appointment is booked for this time
        var isBooked = isAppointmentBooked(time);

        // Add a row to the table for the current time period
        if (isBooked) {
            html += "<tr style='background-color: grey;'><td style='border: 1px solid black; padding: 5px;'>" + time + "</td><td style='border: 1px solid black; padding: 5px;'>Κλεισμένο ραντεβού</td></tr>";
        } else {
            html += "<tr><td style='border: 1px solid black; padding: 5px;'>" + time + "</td><td style='border: 1px solid black; padding: 5px;'></td></tr>";
        }
    }

    html += "</tbody></table>"; // Close the table

    $("#appointments").html(html);
}

function isAppointmentBooked(time) {
    var selectedTime = moment(time).format("HH:mm"); // Format the selected time with moment.js

    // Find a client with an appointment at the selected time
    var client = clients.find(function(client) {
        var appointmentDates = client.appointmentDate.split('#'); // Split the appointment dates into an array
        var appointmentTimes = client.appointmentTime.split('#'); // Split the appointment times into an array

        // Check if the appointment date is the same as the selected date and the appointment time is the same as the selected time
        for (var j = 0; j < appointmentDates.length; j++) {
            var appointmentDate = moment(appointmentDates[j]); // Parse the appointment date with moment.js
            var appointmentTime = moment(appointmentTimes[j], "HH:mm").format("HH:mm"); // Parse the appointment time with moment.js

            if (appointmentDate.isSame(time, 'day') && appointmentTime === selectedTime) {
                return true;
            }
        }

        return false;
    });

    // Return true if a client was found, false otherwise
    return !!client;
}