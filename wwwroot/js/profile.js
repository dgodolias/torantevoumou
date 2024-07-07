// Assuming UserGeneralInfo is a JSON string with user information
var userGeneralInfo = JSON.parse(sessionStorage.getItem("UserGeneralInfo"));

// Function to fill the form with user information
function fillProfileForm() {
    if (userGeneralInfo) {
        document.getElementById("email").value = userGeneralInfo.Email || '';
        document.getElementById("firstName").value = userGeneralInfo.FirstName || '';
        document.getElementById("lastName").value = userGeneralInfo.LastName || '';
        document.getElementById("phoneNumber").value = userGeneralInfo.PhoneNumber || '';
        document.getElementById("username").value = userGeneralInfo.Username || '';
        // Password is not typically stored in session for security reasons
        // document.getElementById("password").value = userGeneralInfo.Password || '';
    }
}

// Call the function to fill the form when the page loads or when appropriate
fillProfileForm();

(function() {
    let currentProfileScale = parseFloat(localStorage.getItem('profilePageScale')) || 1;

    document.getElementById('profile-page').style.transform = `scale(${currentProfileScale})`;

    document.getElementById('zoom-in').addEventListener('click', function() {
        if (currentProfileScale < 1.3) {
            currentProfileScale += 0.07;
            document.getElementById('profile-page').style.transform = `scale(${currentProfileScale})`;
            localStorage.setItem('profilePageScale', currentProfileScale);
        }
    });

    document.getElementById('zoom-out').addEventListener('click', function() {
        if (currentProfileScale > 0.5) {
            currentProfileScale -= 0.07;
            document.getElementById('profile-page').style.transform = `scale(${currentProfileScale})`;
            localStorage.setItem('profilePageScale', currentProfileScale);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const savedScale = localStorage.getItem('profilePageScale');
        if (savedScale) {
            currentProfileScale = parseFloat(savedScale);
            document.getElementById('profile-page').style.transform = `scale(${currentProfileScale})`;
        }
    });
})();

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