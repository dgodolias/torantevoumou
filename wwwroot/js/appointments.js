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
        const formattedSelectedDate = selectedDate.replace(/\//g, '-');
        const appointmentsByDateJson = sessionStorage.getItem('AppointmentsByDate');
        console.log('Appointments by Date:', appointmentsByDateJson);
        const appointmentsByDate = appointmentsByDateJson ? JSON.parse(appointmentsByDateJson) : {};
        const servicesInfoJson = sessionStorage.getItem('ServicesInfo');
        const servicesInfo = servicesInfoJson ? JSON.parse(servicesInfoJson) : {};
        const serviceName = sessionStorage.getItem('serviceName');
        const serviceHours = servicesInfo[serviceName];
        if (!serviceHours) {
            console.error(`Service hours not found for service: ${serviceName}`);
            return;
        }

        const startingTimes = serviceHours.startingTime.split('#').map(time => time.trim());
        const endingTimes = serviceHours.endingTime.split('#').map(time => time.trim());
        const appointmentDuration = parseInt(serviceHours.appointmentDuaration, 10);
        const tableContainer = document.getElementById('appointments-table');
        let tableContent = ''; // Initialize an empty string to build HTML

        startingTimes.forEach((startTime, index) => {
            const endTime = endingTimes[index];
            const startTimeMinutes = convertTimeToMinutes(startTime);
            const endTimeMinutes = convertTimeToMinutes(endTime);

            for (let time = startTimeMinutes; time < endTimeMinutes; time += appointmentDuration) {
                const timeFormatted = convertMinutesToTime(time);
                const isBooked = appointmentsByDate[formattedSelectedDate] && appointmentsByDate[formattedSelectedDate].includes(timeFormatted);
                console.log('Selected date:', formattedSelectedDate, 'Time:', timeFormatted, 'Booked:', isBooked);
                const status = isBooked ? 'closed' : 'free';
                const statusText = isBooked ? 'Κλεισμένη ώρα' : 'Διαθεσιμη ώρα για ραντεβού';
                const dateForId = formattedSelectedDate.replace(/-/g, '_');
                const timeForId = timeFormatted.replace(/:/g, '_');

                tableContent += `<tr>
                    <td>${timeFormatted}</td>
                    <td>${statusText}</td>
                    <td><button id="appointment_${dateForId}_${timeForId}" data-time-index="${(time - startTimeMinutes) / appointmentDuration}" class="${status}">${isBooked ? 'Μη διαθέσιμο' : 'Κλείνω ραντεβού'}</button></td>
                </tr>`;
            }
        });

        tableContainer.innerHTML = tableContent; // Set innerHTML once after building the entire string
    }
    
    // Helper functions to convert between time strings and minutes
    function convertTimeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    function convertMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const minutesRemaining = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutesRemaining.toString().padStart(2, '0')}`;
    }
    

    $(document).on('click', '#appointments-table button', function() {
        loaderElement.style.display = 'flex';
        // Extract date and time directly from the button's ID
        const buttonId = $(this).attr('id');
        const idParts = buttonId.split('_');
        // Assemble selectedDate and timeSlot from parts
        const selectedDate = `${idParts[1]}-${idParts[2]}-${idParts[3]}`; // YYYY-MM-DD format
        const timeSlot = `${idParts[4]}:${idParts[5]}`; // HH:mm format

        console.log('Selected date:', selectedDate, 'Time slot:', timeSlot);

        var UserId = sessionStorage.getItem('UserId');
        var serviceName = sessionStorage.getItem('serviceName');
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

    $('.close-btn').click(function() {
        $('#dialog').dialog('close'); // Using jQuery UI's dialog 'close' method
    });
});