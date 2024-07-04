(function() {
    // Load the current scale from localStorage or set it to 1
    let currentScale = parseFloat(localStorage.getItem('PastAppointmentsScale')) || 1;

    // Apply the current scale to the big container
    document.getElementById('big-container').style.transform = `scale(${currentScale})`;

    // Zoom in button click event
    document.getElementById('zoom-in').addEventListener('click', function() {
        if (currentScale < 2) {
            currentScale += 0.1;
            document.getElementById('big-container').style.transform = `scale(${currentScale})`;
            localStorage.setItem('PastAppointmentsScale', currentScale);
        }
    });

    // Zoom out button click event
    document.getElementById('zoom-out').addEventListener('click', function() {
        if (currentScale > 0.5) {
            currentScale -= 0.1;
            document.getElementById('big-container').style.transform = `scale(${currentScale})`;
            localStorage.setItem('PastAppointmentsScale', currentScale);
        }
    });

    const data = {
        "barbershop": {
            "2024-06-10": ["09:00"],
            "2024-06-13": ["09:00", "09:30"],
            "2024-06-12": ["10:30"],
        },
        "physiotherapy": {
            "2024-07-11": ["09:30"],
            "2024-06-13": ["08:00", "15:30"],
            "2024-06-25": ["10:30"],
        }
    };

    function populateServiceFilter() {
        const serviceFilter = $('#service-filter');
        serviceFilter.empty();
        const services = Object.keys(data);
        if (services.length > 0) {
            serviceFilter.append('<option value="all">Ολες οι υπηρεσιες</option>');
        }
        for (const service of services) {
            serviceFilter.append(`<option value="${service}">${service.charAt(0).toUpperCase() + service.slice(1)}</option>`);
        }
        if (services.length === 0) {
            serviceFilter.append('<option value="none">No services available</option>');
        }
    }

    let currentYear = 2024;
    let dialogTimeout;

    function updateYear() {
        $('#current-year').text(currentYear);
        generateCalendars(currentYear);
    }

    function generateCalendars(year) {
        $('#calendar-container').empty();
        for (let month = 0; month < 12; month++) {
            const monthContainer = $('<div>').addClass('month-container');
            const calendar = $('<div>').addClass('calendar past-appointments-calendar').attr('id', `calendar-${month}`);
            monthContainer.append(calendar);
            $('#calendar-container').append(monthContainer);

            $(`#calendar-${month}`).datepicker({
                showButtonPanel: false,
                changeMonth: false,
                changeYear: false,
                dateFormat: 'yy-mm-dd',
                defaultDate: new Date(year, month, 1),
                beforeShowDay: function(date) {
                    const selectedService = $('#service-filter').val();
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    let isHighlighted = false;
                    if (selectedService === "all") {
                        for (let service in data) {
                            if (data[service][dateStr]) {
                                isHighlighted = true;
                                break;
                            }
                        }
                    } else if (selectedService !== "none") {
                        if (data[selectedService][dateStr]) {
                            isHighlighted = true;
                        }
                    }
                    return [true, isHighlighted ? 'highlight' : ''];
                },
                onChangeMonthYear: function(year, month, inst) {
                    setTimeout(() => {
                        $(`#calendar-${month} .ui-datepicker-current-day`).removeClass('ui-datepicker-current-day');
                        $(`#calendar-${month} .ui-state-active`).removeClass('ui-state-active').attr('aria-current', 'false');
                    }, 1);
                },
                onSelect: function(dateText, inst) {
                    setTimeout(() => {
                        $(`#calendar-${month} .ui-datepicker-current-day`).removeClass('ui-datepicker-current-day');
                        $(`#calendar-${month} .ui-state-active`).removeClass('ui-state-active').attr('aria-current', 'false');
                    }, 1);
                }
            });

            setTimeout(() => {
                $(`#calendar-${month} .ui-datepicker-current-day`).removeClass('ui-datepicker-current-day');
                $(`#calendar-${month} .ui-state-active`).removeClass('ui-state-active').attr('aria-current', 'false');
            }, 1);
        }

        $(document).on('mouseenter.pastappointments', '.highlight a', function(event) {
            if (!$(this).data('clicked')) {
                showAppointmentDialog($(this), event);
            }
        });

        $(document).on('mouseleave.pastappointments', '.highlight a', function() {
            if (!$(this).data('clicked')) {
                hideAppointmentDialog();
            }
        });

        $(document).on('click.pastappointments', '.highlight a', function(event) {
            event.stopPropagation();
            $('.highlight a').data('clicked', false);
            $(this).data('clicked', true);
            clearTimeout(dialogTimeout);
            showAppointmentDialog($(this), event);
            dialogTimeout = setTimeout(hideAppointmentDialog, 3000);
        });

        $(document).on('click.pastappointments', function() {
            hideAppointmentDialog();
        });
    }

    function showAppointmentDialog(element, event) {
        const date = element.text();
        const month = element.closest('.calendar').attr('id').split('-')[1];
        const dateStr = `${currentYear}-${String(parseInt(month) + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        let appointmentDetails = {};
        const selectedService = $('#service-filter').val();

        if (selectedService === "all") {
            for (let service in data) {
                if (data[service][dateStr]) {
                    if (!appointmentDetails[service]) {
                        appointmentDetails[service] = [];
                    }
                    appointmentDetails[service] = appointmentDetails[service].concat(data[service][dateStr]);
                }
            }
        } else {
            if (data[selectedService][dateStr]) {
                appointmentDetails[selectedService] = data[selectedService][dateStr];
            }
        }

        let appointmentText = '';
        for (let service in appointmentDetails) {
            appointmentText += `${service}: ${appointmentDetails[service].join(', ')}<br>`;
        }

        if (appointmentText) {
            $('#appointment-times').html(appointmentText);
            $('#appointment-dialog').css({
                display: 'block',
                left: event.pageX + 15,
                top: event.pageY + 15
            });
        }
    }

    function hideAppointmentDialog() {
        $('#appointment-dialog').css('display', 'none');
        $('.highlight a').data('clicked', false);
    }

    $('#prev-year').on('click.pastappointments', () => {
        currentYear--;
        updateYear();
    });

    $('#next-year').on('click.pastappointments', () => {
        currentYear++;
        updateYear();
    });

    $('#service-filter').on('change.pastappointments', () => {
        generateCalendars(currentYear);
    });

    $(document).ready(() => {
        populateServiceFilter();
        updateYear();
    });
})();
