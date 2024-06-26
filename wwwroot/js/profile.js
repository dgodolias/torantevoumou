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
            loaderElement.style.display = 'flex';
            // The value has changed, send an AJAX request
            var data = {};
            data[selector.slice(1)] = newValue; // Remove the '#' from the selector to get the field name

            // Get UserId from session
            var UserId = sessionStorage.getItem('UserId');

            // Create JSON object
            var json = {
                "UserId": UserId,
                [selector.slice(1)]: newValue
            };

            console.log('Sending JSON:', json);
            // Call Firebase Cloud Function
            fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data.message);
                loaderElement.style.display = 'none'; // Hide the loader element
                setTimeout(() => {
                    alert('User updated successfully'); // Show the alert after a 0.1s delay
                    location.reload();
                }, 100); // 100 milliseconds delay
            })
            .catch((error) => {
                loaderElement.style.display = 'none';
                console.error('Error:', error);
            });
        }

        // Store the new value as the old value for the next time
        $(selector).data('oldValue', newValue);
    } else {
        // If the input field is becoming editable, store its current value as the old value
        $(selector).data('oldValue', $(selector).val());
    }
}