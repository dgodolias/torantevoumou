$(document).ready(function() {
    // Initialize the datepicker
    $('#datepicker').datepicker({
        minDate: 0,
        onSelect: function(dateText) {
            var selectedDate = $.datepicker.formatDate('yy/mm/dd', new Date(dateText));
            sessionStorage.setItem('selectedDate', selectedDate);
            updateAppointmentsForDate(selectedDate);
        }
    });

    const loaderElement = document.querySelector('.loader');
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
        show: {
            effect: 'fade',
            duration: 1000
        },
        hide: {
            effect: 'fade',
            duration: 1000
        },
        open: function() {
            $('#blurOverlay').fadeIn(1000);
        },
        beforeClose: function() {
            $('#blurOverlay').fadeOut(1000);
        }
    });

    $('#serviceList .serviceItem').on('click', function() {
        var serviceName = $(this).attr('id');
        console.log('You clicked on service: ' + serviceName);
        sessionStorage.setItem('serviceName', serviceName);
        $('#dialog').dialog('open');
        fetchServiceAppointments(serviceName);
    });

    function fetchServiceAppointments(serviceName) {
        fetch(`https://us-central1-torantevoumou-86820.cloudfunctions.net/getServiceDetailedAppointments?service=${serviceName}&date=${sessionStorage.getItem('selectedDate')}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                processAppointmentData(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    function processAppointmentData(data) {
        const firstKey = Object.keys(data)[0];
        const appointmentsData = data[firstKey];

        if (Array.isArray(appointmentsData)) {
            // Process as array
        } else if (typeof appointmentsData === 'object' && appointmentsData !== null) {
            const appointmentsByDate = {};
            Object.entries(appointmentsData).forEach(([key, appointment]) => {
                const { appointmentDate, appointmentTime } = appointment;
                if (!appointmentsByDate[appointmentDate]) {
                    appointmentsByDate[appointmentDate] = [];
                }
                appointmentsByDate[appointmentDate].push(appointmentTime);
            });
            console.log('Appointments by Date:', appointmentsByDate);
            sessionStorage.setItem('AppointmentsByDate', JSON.stringify(appointmentsByDate));
        } else {
            console.log('Unexpected data structure:', appointmentsData);
        }
    }

    function updateAppointmentsForDate(selectedDate) {
        // Retrieve appointments data from session storage
        const appointmentsByDateJson = sessionStorage.getItem('AppointmentsByDate');
        const appointmentsByDate = appointmentsByDateJson ? JSON.parse(appointmentsByDateJson) : {};

        // Define start and end times
        const startTime = 9 * 60; // 9:00 AM in minutes
        const endTime = 21 * 60; // 9:00 PM in minutes
        const interval = 30; // 30 minutes

        // Get the table container
        const tableContainer = document.getElementById('appointments-table');
        tableContainer.innerHTML = ''; // Clear existing table content

        // Generate time slots and table rows
        for (let time = startTime; time < endTime; time += interval) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // Check if the time slot is booked
            const isBooked = appointmentsByDate[selectedDate] && appointmentsByDate[selectedDate].includes(timeFormatted);
            const status = isBooked ? 'closed' : 'free';
            const statusText = isBooked ? 'Κλεισμένη ώρα' : 'Διαθεσιμη ώρα για ραντεβού';

            // Create table row
            // Create table row with updated button text for closed appointments
            const row = `<tr>
                <td>${timeFormatted}</td>
                <td>${statusText}</td>
                <td><button data-time-index="${(time - startTime) / interval}" class="${status}">${isBooked ? 'Μη διαθέσιμο' : 'Κλείνω ραντεβού'}</button></td>
            </tr>`;

            // Append row to table
            tableContainer.innerHTML += row;
        }
    }

    $(document).on('click', '#appointments-table button', function() {
        loaderElement.style.display = 'flex';
        const index = $(this).data('time-index');
        const timeSlot = calculateTimeSlot(index);
        console.log('Time slot:', timeSlot);
        var UserId = sessionStorage.getItem('UserId');
        var serviceName = sessionStorage.getItem('serviceName');
        var selectedDate = sessionStorage.getItem('selectedDate');
        var appointmentData = {
            UserId: UserId,
            serviceName: serviceName,
            appointmentDate: selectedDate,
            appointmentTime: timeSlot
        };
        var json = JSON.stringify(appointmentData);
        console.log('Sending JSON:', json);
        addAppointment(json);
    });

    function calculateTimeSlot(index) {
        const startTime = 9 * 60; // 9:00 AM in minutes
        const timeInMinutes = startTime + (index * 30);
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function addAppointment(json) {
        fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/addAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data.message);
            loaderElement.style.display = 'none';
            setTimeout(() => {
                alert('Your appointment has been successfully booked!');
                location.reload();
            }, 100);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});