
function initializeDatepicker(selector, callback, disablePastDates) {
    $(selector).datepicker({
        inline: true,
        minDate: disablePastDates ? 0 : null,
        onSelect: function(dateText) {
            var date = new Date(dateText);
            callback(date);
        }
    });
}

$(function() {
    initializeDatepicker("#datepickerForAdmin", fetchUsersForAdmin, false);
    initializeDatepicker("#datepickerappointments", fetchUsersAppointments, true);
});


function fetchUsersForAdmin(date) {
    var selectedDate = moment(date, "MM/DD/YYYY"); // Parse the selected date with moment.js

    // Create a table
    var html = `
        <table style='border-collapse: collapse; width: 100%;'>
            <thead>
                <tr>
                    <th style='border: 1px solid black; padding: 5px;'>Time</th>
                    <th style='border: 1px solid black; padding: 5px;'>Id</th>
                    <th style='border: 1px solid black; padding: 5px;'>First Name</th>
                    <th style='border: 1px solid black; padding: 5px;'>Last Name</th>
                    <th style='border: 1px solid black; padding: 5px;'>Username</th>
                    <th style='border: 1px solid black; padding: 5px;'>Email</th>
                    <th style='border: 1px solid black; padding: 5px;'>Phone Number</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Loop through each 30-minute period from 9 AM to 9 PM
    for (var i = 9; i <= 21; i += 0.5) {
        var time = moment({hour: Math.floor(i), minute: (i % 1) * 60}).format("HH:mm");

        // Find the user for the current time period
        console.log(users);
        var user = users.find(function(user) {
            if (user.appointmentDate !== null && user.appointmentDate !== ''
                && user.appointmentTime !== null && user.appointmentTime !== '') {
                var appointmentDates = user.appointmentDate.split('#'); // Split the appointment dates into an array
                var appointmentTimes = user.appointmentTime.split('#'); // Split the appointment times into an array

                // Check if the appointment date is the same as the selected date and the appointment time is the same as the current time
                for (var j = 0; j < appointmentDates.length; j++) {
                    var appointmentDate = moment(appointmentDates[j]); // Parse the appointment date with moment.js
                    var appointmentTime = moment(appointmentTimes[j], "HH:mm").format("HH:mm"); // Parse the appointment time with moment.js

                    if (appointmentDate.isSame(selectedDate, 'day') && appointmentTime === time) {
                        return true;
                    }
                }
            }
            return false;
        });

        // Add a row to the table for the current time period
        if (user) {
            console.log(user);
            html += `
                <tr>
                    <td style='border: 1px solid black; padding: 5px;'>${time}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.id}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.firstName}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.lastName}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.username}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.email}</td>
                    <td style='border: 1px solid black; padding: 5px;'>${user.phoneNumber}</td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td style='border: 1px solid black; padding: 5px;'>${time}</td>
                    <td style='border: 1px solid black; padding: 5px;' colspan='6'></td>
                </tr>
            `;
        }
    }

    html += "</tbody></table>"; // Close the table

    $("#matchingUsers").html(html);
}

function fetchUsersAppointments(date) {
    var selectedDate = moment(date, "MM/DD/YYYY");
    console.log("globalAppointments: ", globalAppointments);

    var html = `
        <table style='border-collapse: collapse; width: 100%;'>
            <thead>
                <tr>
                    <th style='border: 1px solid black; padding: 5px;'>Time</th>
                    <th style='border: 1px solid black; padding: 5px;'>Appointments</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (var i = 9; i <= 21; i += 0.5) {
        var time = moment({hour: Math.floor(i), minute: (i % 1) * 60}).format("HH:mm");

        var appointment = globalAppointments.find(function(appointment) {
            var appointmentDate = moment(appointment.appointmentDate);
            var appointmentTime = moment(appointment.appointmentTime, "HH:mm").format("HH:mm");

            return appointmentDate.isSame(selectedDate, 'day') && appointmentTime === time;
        });

        if (appointment) {
            html += `
                <tr>
                    <td style='border: 1px solid black; padding: 5px;'>${time}</td>
                    <td style='border: 1px solid black; padding: 5px;'>Κλεισμένο ραντεβού</td>
                </tr>
            `;
        } else {
            var currentTime = moment();
            var rowTime = moment(time, "HH:mm");

            if (selectedDate.isSame(currentTime, 'day') && rowTime.isBefore(currentTime)) {
                html += `
                    <tr>
                        <td style='border: 1px solid black; padding: 5px;'>${time}</td>
                        <td style='border: 1px solid black; padding: 5px;'>Κλεισμένο ραντεβού</td>
                    </tr>
                `;
            } else {
                html += `
                    <tr>
                        <td style='border: 1px solid black; padding: 5px;'>${time}</td>
                        <td style='border: 1px solid black; padding: 5px;'>
                            <button class='appointment-button' data-time='${time}'>Διαθέσιμο για ραντεβού</button>
                        </td>
                    </tr>
                `;
            }
        }
    }

    html += "</tbody></table>";


    $("#appointments").html(html);

    $(".appointment-button").click(function() {
    var futureDate = selectedDate.format("YYYY-MM-DD") + "#";
    var futureTime = moment($(this).data("time"), "HH:mm").format("HH:mm:ss") + "#";
    var selectedService;
    console.log("CHECK");
    $.ajax({
        url: '/api/UpdateUserAppointment',
        type: 'POST',
        contentType: 'application/json', // Set the content type
        data: JSON.stringify({ // Convert the data to a JSON string
            Date: futureDate,
            Time: futureTime
        }),
        success: function(result) {
            console.log("Appointment added successfully");
            location.reload(); // Reload the page
        },
        error: function(error) {
            console.error("Error adding appointment: ", error);
        }
    });

    $.ajax({
    url: '/api/GetSelectedService',
    type: 'GET',
    success: function(service) {
        console.log("Selected service: ", service);
        // Store the value in a variable
        selectedService = service;
        // Now you can use `service` inside this function
    },
    error: function(error) {
        console.error("Error getting selected service: ", error);
    }
});

    console.log(futureDate, futureTime, selectedDate)
});
}