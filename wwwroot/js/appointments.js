$(document).ready(function() {
    // Initialize the datepicker
    $('#datepicker').datepicker({
        minDate: 0
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
        modal: false,
        show: {
            effect: 'fade',
            duration: 1000
        },
        hide: {
            effect: 'fade',
            duration: 1000
        },
        open: function() {
            // Show the overlay with the blur effect when the dialog is opened
            $('#blurOverlay').fadeIn(1000);
        },
        beforeClose: function() {
            // Hide the overlay when the dialog is closed
            $('#blurOverlay').fadeOut(1000);
        }
    });

    $('#serviceList .serviceItem').on('click', function() {
        var serviceName = $(this).attr('id');
        console.log('You clicked on service: ' + serviceName);
        sessionStorage.setItem('serviceName', serviceName);
        // Open the dialog
        $('#dialog').dialog('open');
    });

    function calculateTimeSlot(index) {
        // Starting time is 9:00 (9 hours from midnight)
        const startTime = 9 * 60; // 9 hours in minutes
        const timeInMinutes = startTime + (index * 30); // Add 30 minutes for each index
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Attach click event listener to each button
    $('#appointments-table button').on('click', function() {
        loaderElement.style.display = 'flex';
        const index = $(this).data('time-index');
        const timeSlot = calculateTimeSlot(index);
        console.log('Time slot:', timeSlot);
        // Assuming UserId is available globally or from sessionStorage
        var UserId = sessionStorage.getItem('UserId');
        // Retrieve serviceName from sessionStorage
        var serviceName = sessionStorage.getItem('serviceName');
        // Retrieve selected date from datepicker
        var selectedDate = $('#datepicker').datepicker('getDate');
        selectedDate = $.datepicker.formatDate('yy/mm/dd', selectedDate);
        // Construct the JSON object including the time
        var appointmentData = {
            UserId: UserId,
            serviceName: serviceName,
            appointmentDate: selectedDate,
            appointmentTime: timeSlot
        };
        // Convert the object to JSON and send
        var json = JSON.stringify(appointmentData);
        console.log('Sending JSON:', json);
        // Call Firebase Cloud Function
        fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/addAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Επιτυχία:', data.message);

            loaderElement.style.display = 'none'; // Hide the loader element
            setTimeout(() => {
                alert('Το ραντεβού σας καταχωρήθηκε επιτυχώς!'); // Show the alert after a 0.1s delay
                location.reload();
            }, 100);
        })
        .catch((error) => {
            console.error('Σφάλμα:', error);
        });
    });
});