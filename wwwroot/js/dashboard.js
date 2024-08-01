const loaderElement = document.querySelector('.loader');

window.addEventListener('load', function () {
    checkLoginStatus();

    const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Embedding the appointments view in the dashboard view
    $(document).ready(function () {
        var userId = sessionStorage.getItem('UserId');
        
        if (userId) {
            Init(userId); // Call the refactored function
        }        

        console.log('User ID: ', userId);

        // Load appointments.js before loading the appointments.cshtml content
        $.getScript('/js/appointments.js', function () {
            // Now you can safely use functions from appointments.js
            $('#container').load('/appointments?userId=' + userId);
        });

        $('#appointmentLink').click(function (e) {
            e.preventDefault();
            $('#container').load('/appointments?userId=' + userId);
        });

        $('#pastappointmentLink').click(function (e) {
            e.preventDefault();
            $('#container').html('<iframe src="/heatmap" style="width:100%; height:100%; border:none;"></iframe>');
        });

        $("#profileLink").click(function (e) {
            e.preventDefault();
            $("#container").load("/profile?userId=" + userId);
        });

        // Logout functionality
        const logoutButton = document.querySelector('.bottom-content a');
        if (logoutButton) {
            console.log('Logout button found:', logoutButton);
            logoutButton.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent the default anchor action
                console.log('Logout button clicked');

                // Clear the session storage
                sessionStorage.clear();

                sessionStorage.setItem('userLoggedIn', 'false');
                window.location.href = '/Login';
            });
        }

    });

    // Fetch call to cloud function after the page has fully loaded
    fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/getServicesInfo')
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('ServicesInfo', JSON.stringify(data));
            console.log('ServicesInfo saved to sessionStorage:', data);
        })
        .catch(error => console.error('Error fetching ServicesInfo:', error));
});

// This function checks the login status
function checkLoginStatus() {
    if (sessionStorage.getItem('userLoggedIn') === 'false') {
        window.location.href = '/Login';
    }
}

async function Init(userId) {
    const url = `https://us-central1-torantevoumou-86820.cloudfunctions.net/getUserGeneralInfo?userId=${userId}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(async data => {
            sessionStorage.setItem('UserGeneralInfo', JSON.stringify(data));
            console.log('UserGeneralInfo:', data);

            // Extract service names
            let serviceNames = data.serviceswithappointmentkey.split('#')
                .filter(s => s.trim() !== '' && s.includes('('))
                .map(s => s.split('(')[0])
                .filter(s => s.trim() !== '');

            sessionStorage.setItem('ServiceNames', JSON.stringify(serviceNames));
            console.log('ServiceNames:', serviceNames);

            // Create the dictionary
            let serviceAppointments = {};
            serviceNames.forEach(serviceName => {
                serviceAppointments[serviceName] = [];
            });
            
            data.serviceswithappointmentkey.split('#')
                .filter(s => s.trim() !== '' && s.includes('('))
                .forEach(s => {
                    let parts = s.split('(');
                    let serviceName = parts[0];
                    let appointmentIds = parts[1].slice(0, -1).split(','); // Remove the closing parenthesis and split
                    serviceAppointments[serviceName] = appointmentIds;
                });
            

            sessionStorage.setItem('ServiceJustKeysAppointments', JSON.stringify(serviceAppointments));
            console.log('ServiceJustKeysAppointments:', JSON.stringify(serviceAppointments));

            // Fetch detailed appointments
            let appointments = [];
            const appointmentUrl = `https://us-central1-torantevoumou-86820.cloudfunctions.net/getUserAppointments`;
            console.log('Sending JSON OBJ:', JSON.stringify(serviceAppointments));
            let serviceAppointmentsData = await fetch(appointmentUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceAppointments) // Send the entire dictionary
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('Error fetching Service Appointments:', error);
                    return []; // Handle error gracefully
                });
            appointments.push(...serviceAppointmentsData);

            sessionStorage.setItem('UserDetailedAppointments', JSON.stringify(appointments));
            console.log('UserDetailedAppointments:', JSON.stringify(appointments));
        })
        .catch(error => {
            console.error('Error fetching UserGeneralInfo:', error);
        });
}


// Use the onpageshow event to handle the back button scenario
window.onpageshow = function (event) {
    // This ensures the check is performed even when the page is loaded from the cache
    if (event.persisted) {
        checkLoginStatus();
    }
};