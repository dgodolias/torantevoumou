$(document).ready(function () {

    // New function to encapsulate shared logic
    async function handleDateOrServiceSelection() {

        loaderElement.style.display = 'flex';
        // Await the fetchServiceAppointments to ensure it completes before moving on
        await processAppointmentData(JSON.parse(sessionStorage.getItem('AllDetailedAppointmentsForService')));
        loaderElement.style.display = 'none';


        // The rest of your code here will execute after fetchServiceAppointments has finished
        const servicesInfoStr = sessionStorage.getItem('ServicesInfo');
        const servicesNameStr = sessionStorage.getItem('serviceName');
        const servicesInfo = servicesInfoStr ? JSON.parse(servicesInfoStr) : {};
        const serviceNameVar = servicesNameStr ? servicesNameStr : "No Service Name";
        const serviceValue = servicesInfo[serviceNameVar];

        console.log('Services Info:', servicesInfo);
        console.log('Service Name:', serviceNameVar);
        console.log('Service Value:', JSON.stringify(serviceValue));

        // Extract operational hours
        const startingTimes = serviceValue.startingTime.split('#').filter(Boolean);
        const endingTimes = serviceValue.endingTime.split('#').filter(Boolean);
        const appointmentDuration = parseInt(serviceValue.appointmentDuaration, 10);

        // Calculate total operational hours
        let totalOperationalMinutes = 0;
        for (let i = 0; i < startingTimes.length; i++) {
            const startHour = parseInt(startingTimes[i].split(':')[0], 10);
            const endHour = parseInt(endingTimes[i].split(':')[0], 10);
            totalOperationalMinutes += (endHour - startHour) * 60;
        }

        // Calculate number of possible appointments per day
        const maxAppointmentsPerDay = totalOperationalMinutes / appointmentDuration;

        const appointmentsByDateStr = sessionStorage.getItem('AppointmentsByDate');
        const appointmentsByDate = appointmentsByDateStr ? JSON.parse(appointmentsByDateStr) : {};

        Object.keys(appointmentsByDate).forEach(date => {
            const formattedDate = date.replace(/\//g, '-');
            const cellId = `date-${formattedDate}`;
            const appointments = appointmentsByDate[date];
            const appointmentPercentage = (appointments.length / maxAppointmentsPerDay) * 100;

            // Change cell background color based on appointments percentage using classes
            if (appointmentPercentage > 15) {
                $(`.${cellId} a`).addClass('blue-background').removeClass('red-background white-background');
            } else if (appointments.length > 2) {
                $(`.${cellId} a`).addClass('red-background').removeClass('blue-background white-background');
            } else {
                $(`.${cellId} a`).addClass('white-background').removeClass('blue-background red-background');
            }
        });
    }

    $('#datepicker').datepicker({
        minDate: 0, // Allow selection from today onwards
        maxDate: '+1y', // Allow selection up to one year from today
        onSelect: function (dateText) {
            var selectedDate = $.datepicker.formatDate('yy/mm/dd', new Date(dateText));
            sessionStorage.setItem('selectedDate', selectedDate);
            updateAppointmentsForDate(selectedDate);
            const serviceNam = sessionStorage.getItem('serviceName');
            handleDateOrServiceSelection(serviceNam, selectedDate);
        },
        beforeShowDay: function (date) {
            // Disable past dates
            if (date < new Date()) {
                return [false];
            }

            // Generate a unique ID for each date cell
            const dateString = $.datepicker.formatDate('yy-mm-dd', date);
            const cellId = `date-${dateString}`;

            return [true, cellId, ''];
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
            duration: 500
        },
        hide: {
            effect: 'fade',
            duration: 1000
        },
        open: function (event, ui) {
            $('#blurOverlay').fadeIn(1000);
            $(document).on('mousedown.dialogCloseEvent', function (e) {
                var container = $(".ui-dialog");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $('#dialog').dialog('close');
                }
            });
        },
        beforeClose: function (event, ui) {
            $('#blurOverlay').fadeOut(1000);
            $(document).off('mousedown.dialogCloseEvent'); // Unbind the event listener

            // Reset datepicker cells to default state by removing custom background classes
            $('#datepicker').find('a').removeClass('blue-background red-background white-background');
        }
    });


    $('#serviceList .serviceItem').on('click', async function () { // Mark this function as async
        var serviceName = $(this).attr('id');
        // Await the fetchServiceAppointments to ensure it completes before moving on
        await fetchServiceAppointments(serviceName);

        console.log('You clicked on service: ' + serviceName);
        sessionStorage.setItem('serviceName', serviceName);
        $('#dialog').dialog('open');

        handleDateOrServiceSelection(serviceName);
    });

    function fetchServiceAppointments(serviceName) {
        return fetch(`https://us-central1-torantevoumou-86820.cloudfunctions.net/getServiceDetailedAppointments?service=${serviceName}&date=${sessionStorage.getItem('selectedDate')}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                sessionStorage.setItem('AllDetailedAppointmentsForService', JSON.stringify(data));
                return data; // Ensure to return data if needed later
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

        // Get current date and time in Unix timestamp
        const currentDate = new Date();
        const currentUnixTime = Math.floor(currentDate.getTime() / 1000);

        startingTimes.forEach((startTime, index) => {
            const endTime = endingTimes[index];
            const startTimeMinutes = convertTimeToMinutes(startTime);
            const endTimeMinutes = convertTimeToMinutes(endTime);

            for (let time = startTimeMinutes; time < endTimeMinutes; time += appointmentDuration) {
                const timeFormatted = convertMinutesToTime(time);
                const appointmentDateTime = new Date(`${formattedSelectedDate} ${timeFormatted}`);
                const appointmentUnixTime = Math.floor(appointmentDateTime.getTime() / 1000);

                const isBooked = appointmentsByDate[formattedSelectedDate] && appointmentsByDate[formattedSelectedDate].includes(timeFormatted) || currentUnixTime > appointmentUnixTime;
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


    $(document).on('click', '#appointments-table button', function () {
        // Check if the clicked button has the 'closed' class
        if ($(this).hasClass('closed')) {
            // If the button is closed, do not proceed with the booking
            console.log('This appointment slot is not available.');
            return; // Exit the function early
        }

        loaderElement.style.display = 'flex';
        // The rest of your existing code for handling the click event...

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

    $('.close-btn').click(function () {
        $('#dialog').dialog('close'); // Using jQuery UI's dialog 'close' method
    });
});