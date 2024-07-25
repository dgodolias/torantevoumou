const loaderElement = document.querySelector('.loader');

window.addEventListener('load', function() {
    checkLoginStatus();

    const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle")

    toggle.addEventListener("click" , () => {
        sidebar.classList.toggle("close");
    });

    // Embedding the appointments view in the dashboard view
    $(document).ready(function () {
        var userId = sessionStorage.getItem('UserId');
        console.log('User ID: ', userId);

        const pastappointments = { "Κουρείο TheFriendsBarbershop": { "2024-06-13": ["09:00", "09:30"], "2024-06-12": ["10:30"], "2024-06-28": ["10:30", "10:00", "16:00", "15:30", "18:30"], "2024-06-17": ["16:00", "11:00", "10:00"], "2024-06-15": ["18:00", "11:30", "09:30"], "2024-06-29": ["10:00"], "2024-07-13": ["11:30"] }, "Φυσιοθεραπευτήριο Παπαγιάννης": { "2024-07-19": ["18:00"] } };
        
        // Stringify and store in sessionStorage
        sessionStorage.setItem('pastappointments', JSON.stringify(pastappointments));


        // Load appointments.js before loading the appointments.cshtml content
        $.getScript('/js/appointments.js', function() {
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
        const logoutButton = Array.from(document.querySelectorAll('.nav-text')).find(el => el.textContent.trim() === 'Logout');
        if (logoutButton) {
            logoutButton.closest('a').addEventListener('click', function(e) {
                e.preventDefault(); // Prevent the default anchor action

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

// Use the onpageshow event to handle the back button scenario
window.onpageshow = function(event) {
    // This ensures the check is performed even when the page is loaded from the cache
    if (event.persisted) {
        checkLoginStatus();
    }
};
