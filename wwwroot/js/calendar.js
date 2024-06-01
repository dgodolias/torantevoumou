
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
    var selectedDate = moment(date, "MM/DD/YYYY");
}

function fetchUsersAppointments(date) {
    var selectedDate = moment(date, "MM/DD/YYYY");
}