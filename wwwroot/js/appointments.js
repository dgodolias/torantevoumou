(function () {
    let currentAppointmentsScale = parseFloat(localStorage.getItem('appointmentsPageScale')) || 1;
    let container = document.getElementById('inside-appointment-flex-container');
    console.log(container);
    if (container){
        container.style.transform = `scale(${currentAppointmentsScale})`;

        document.getElementById('zoom-in').addEventListener('click', function () {
            if (currentAppointmentsScale < 1.3) {
                currentAppointmentsScale += 0.07;
                container.style.transform = `scale(${currentAppointmentsScale})`;
                localStorage.setItem('appointmentsPageScale', currentAppointmentsScale);
            }
        });

        document.getElementById('zoom-out').addEventListener('click', function () {
            if (currentAppointmentsScale > 0.5) {
                currentAppointmentsScale -= 0.07;
                container.style.transform = `scale(${currentAppointmentsScale})`;
                localStorage.setItem('appointmentsPageScale', currentAppointmentsScale);
            }
        });
        
    }
})();

$(document).ready(function () {
    cellColours = ['purple1', 'purple2', 'purple3', 'purple4', 'grey-background'];

    $('#datepicker').datepicker({
        firstDay: 1,
        minDate: 0,
        maxDate: '+1y',
        // Add the language setting here
        dateFormat: 'dd/mm/yy', // Use Greek date format
        dayNamesMin: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'], // Greek day names
        monthNames: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'], // Greek month names
        onSelect: function (dateText) {
            var selectedDate = $.datepicker.formatDate('yy/mm/dd', new Date(dateText));
            sessionStorage.setItem('selectedDate', selectedDate);
            updateAppointmentsForDate(selectedDate);
            handleDateOrServiceSelection();
            $('#appointments-table').css('display', 'block');
        },
        beforeShowDay: function (date) {
            if (date < new Date()) {
                return [false];
            }
            const dateString = $.datepicker.formatDate('yy-mm-dd', date);
            const cellId = `date-${dateString}`;

            // Check if the date is within the allowed range for the selected service
            const serviceName = sessionStorage.getItem('serviceName');
            const servicesInfo = JSON.parse(sessionStorage.getItem('ServicesInfo'));
            const allowedDates = servicesInfo[serviceName].dates.split('/');

            let isDateAllowed = false;
            allowedDates.forEach(dateRange => {
                const [startDate, endDate] = dateRange.split('...');
                // Convert startDate to a Date object
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Remove time component from both dates
                date.setHours(0, 0, 0, 0); // Set time to midnight
                start.setHours(0, 0, 0, 0); // Set time to midnight

                if (date >= start && date <= end) {
                    isDateAllowed = true;
                }
            });

            return [isDateAllowed, cellId, ''];
        },

        onChangeMonthYear: function () {
            handleDateOrServiceSelection();
        }
    });

    var viewportHeight = $(window).height();
    var dialogHeight = viewportHeight * 0.8;

    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        width: "fit-content",
        height: dialogHeight,
        draggable: false,
        resizable: false,
        hide: {
            effect: 'fade',
            duration: 1000
        },
        open: function (event, ui) {
            $('#blurOverlay').show();
            $(document).on('mousedown.dialogCloseEvent', function (e) {
                var container = $(".ui-dialog");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $('#dialog').dialog('close');
                }
            });
        },
        beforeClose: function (event, ui) {
            $('#blurOverlay').fadeOut(1000);
            $(document).off('mousedown.dialogCloseEvent');

            $('#datepicker').find('a').removeClass(cellColours.join(' '));
            $('#appointments-table').css('display', 'none');
        }
    });

    $('.close-btn').on('click.appointments', function () {
        $('#dialog').dialog('close');
    });
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

    console.log('Services Info:', JSON.stringify(servicesInfo));
    console.log('Service Name:', serviceNameVar);
    console.log('Service Value:', JSON.stringify(serviceValue));

    const appointmentsByDateStr = sessionStorage.getItem('AppointmentsByDate');
    const appointmentsByDate = appointmentsByDateStr ? JSON.parse(appointmentsByDateStr) : {};

    Object.keys(appointmentsByDate).forEach(date => {
        const formattedDate = date.replace(/\//g, '-');
        const cellId = `date-${formattedDate}`;
        const appointments = appointmentsByDate[date];

        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const hoursArray = serviceValue.hours.split(')(');
        const dayHours = hoursArray[dayOfWeek - 1] ? hoursArray[dayOfWeek - 1].replace('(', '').replace(')', '') : '';
        const timePeriods = dayHours.split('#').filter(Boolean);
        const appointmentDuration = parseInt(serviceValue.appointmentduration, 10);

        // Calculate total operational minutes
        let totalOperationalMinutes = 0;
        timePeriods.forEach(period => {
            const [start, end] = period.split('-');
            const startTime = new Date(`${formattedDate}T${start}`);
            const endTime = new Date(`${formattedDate}T${end}`);
            totalOperationalMinutes += (endTime - startTime) / (1000 * 60); // Convert ms to minutes
        });

        // Calculate number of possible appointments per day
        const maxAppointmentsPerDay = totalOperationalMinutes / appointmentDuration;

        const appointmentPercentage = (appointments.length / maxAppointmentsPerDay) * 100;

        // Change cell background color based on appointments percentage using classes
        if (appointmentPercentage === 0) {
            $(`.${cellId} a`).removeClass(cellColours.join(' '));
        } else if (appointmentPercentage < 25) {
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
    const appointmentDuration = parseInt(serviceHours.appointmentduration, 10);
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

    // Detach existing event handler before attaching a new one to avoid multiple bindings
    $(document).off('click', '#appointments-table button');
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
