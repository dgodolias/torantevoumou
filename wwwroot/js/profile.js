$("#changeEmail").click(function () {
    toggleReadonly("#email");
});

$("#changeFirstName").click(function () {
    toggleReadonly("#firstName");
});

$("#changeLastName").click(function () {
    toggleReadonly("#lastName");
});

$("#changeUsername").click(function () {
    toggleReadonly("#username");
});

$("#changePassword").click(function () {
    toggleReadonly("#password");
});
$("#changePhoneNumber").click(function () {
    toggleReadonly("#phoneNumber");
});

function toggleReadonly(selector) {
    var isReadonly = $(selector).prop("readonly");
    $(selector).prop("readonly", !isReadonly);
    $(selector).toggleClass("readonly", isReadonly);

    // If the input field is becoming readonly, check if its value has changed
    if (!isReadonly) {
        var newValue = $(selector).val();
        var oldValue = $(selector).data('oldValue');

        if (newValue !== oldValue) {
            // The value has changed, send an AJAX request
            var data = {};
            data[selector.slice(1)] = newValue; // Remove the '#' from the selector to get the field name

            $.ajax({
                url: '/api/updateUser',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
                    alert('Update successful!');
                },
                error: function (error) {
                    console.log(error);
                    alert('Update failed. Please try again.');
                }
            });
        }

        // Store the new value as the old value for the next time
        $(selector).data('oldValue', newValue);
    } else {
        // If the input field is becoming editable, store its current value as the old value
        $(selector).data('oldValue', $(selector).val());
    }
}