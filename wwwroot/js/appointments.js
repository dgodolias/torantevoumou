$(document).ready(function () {
    cellColours = ['purple1', 'purple2', 'purple3', 'purple4', 'grey-background'];

    $('#datepicker').datepicker({
        firstDay: 1, // Monday as the first day of the week
        minDate: 0, // Allow selection from today onwards
        maxDate: '+1y', // Allow selection up to one year from today
        onSelect: function (dateText) {
            var selectedDate = $.datepicker.formatDate('yy/mm/dd', new Date(dateText));
            sessionStorage.setItem('selectedDate', selectedDate);
            updateAppointmentsForDate(selectedDate);
            handleDateOrServiceSelection();
            $('#appointments-table').css('display', 'block');
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
        },
        onChangeMonthYear: function () {
            handleDateOrServiceSelection();
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
            $('#datepicker').find('a').removeClass(cellColours.join(' '));
            // Set #appointments-table display to none
            $('#appointments-table').css('display', 'none');
        }
    });

    async function handleDateOrServiceSelection() {
        loaderElement.style.display = 'flex';
        await processAppointmentData(JSON.parse(sessionStorage.getItem('AllDetailedAppointmentsForService')));
        loaderElement.style.display = 'none';

        const servicesInfoStr = sessionStorage.getItem('ServicesInfo');
        const servicesNameStr = sessionStorage.getItem('serviceName');
        const servicesInfo = servicesInfoStr ? JSON.parse(servicesInfoStr) : {};
        const serviceNameVar = servicesNameStr ? servicesNameStr : "No Service Name";
        const serviceValue = servicesInfo[serviceNameVar];

        console.log('Services Info:', servicesInfo);
        console.log('Service Name:', serviceNameVar);
        console.log('Service Value:', JSON.stringify(serviceValue));

        // Extract operational hours for the selected day of the week
        const selectedDate = new Date(sessionStorage.getItem('selectedDate'));
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const hoursArray = serviceValue.hours.split(')(');
        const dayHours = hoursArray[dayOfWeek - 1] ? hoursArray[dayOfWeek - 1].replace('(', '').replace(')', '') : '';


        const timePeriods = dayHours.split('#').filter(Boolean);
        const appointmentDuration = parseInt(serviceValue.appointmentDuaration, 10);

        // Calculate total operational minutes
        let totalOperationalMinutes = 0;
        timePeriods.forEach(period => {
            const [start, end] = period.split('-');
            const startHour = parseInt(start.split(':')[0], 10);
            const endHour = parseInt(end.split(':')[0], 10);
            totalOperationalMinutes += (endHour - startHour) * 60;
        });

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
            if (appointmentPercentage === 0) {
            }
            else if (appointmentPercentage < 25) {
                $(`.${cellId} a`).removeClass(cellColours.join(' ')).addClass(cellColours[0]);
            } else if (appointmentPercentage < 50) {
                $(`.${cellId} a`).removeClass(cellColours.join(' ')).addClass(cellColours[1]);
            } else if (appointmentPercentage < 75) {
                $(`.${cellId} a`).removeClass(cellColours.join(' ')).addClass(cellColours[2]);
            } else if (appointmentPercentage < 100) {
                $(`.${cellId} a`).removeClass(cellColours.join(' ')).addClass(cellColours[3]);
            } else {
                $(`.${cellId} a`).removeClass(cellColours.join(' ')).addClass(cellColours[4]);
            }
        });
    }

    $('#serviceList .serviceItem').on('click', async function () {
        var serviceName = $(this).attr('id');

        loaderElement.style.display = 'flex';
        await fetchServiceAppointments(serviceName);
        loaderElement.style.display = 'none';

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
                return data;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    function processAppointmentData(data) {
        const firstKey = Object.keys(data)[0];
        const appointmentsData = data[firstKey];

        if (Array.isArray(appointmentsData)) {
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

        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayHours = serviceHours.hours.split(')(')[dayOfWeek - 1]?.replace('(', '').replace(')', '') || '';
        const timePeriods = dayHours.split('#').filter(Boolean);
        const appointmentDuration = parseInt(serviceHours.appointmentDuaration, 10);
        const tableContainer = document.getElementById('appointments-table');
        let tableContent = ''; // Initialize an empty string to build HTML

        if (!dayHours || !timePeriods.length) {
            tableContent = `
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3" style="text-align:center;">Δεν υπάρχουν διαθέσιμα ραντεβου</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
                <tr><td colspan="3">&nbsp;</td></tr>
            `;
            tableContainer.innerHTML = tableContent;
            return;
        }

        // Get current date and time in Unix timestamp
        const currentDate = new Date();
        const currentUnixTime = Math.floor(currentDate.getTime() / 1000);

        timePeriods.forEach(period => {
            const [start, end] = period.split('-');
            const startTimeMinutes = convertTimeToMinutes(start);
            const endTimeMinutes = convertTimeToMinutes(end);

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
        if ($(this).hasClass('closed')) {
            console.log('This appointment slot is not available.');
            return;
        }

        loaderElement.style.display = 'flex';

        const buttonId = $(this).attr('id');
        const idParts = buttonId.split('_');
        const selectedDate = `${idParts[1]}-${idParts[2]}-${idParts[3]}`;
        const timeSlot = `${idParts[4]}:${idParts[5]}`;

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
        $('#dialog').dialog('close');
    });
});
