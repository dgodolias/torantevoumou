// Get the login time from the session storage
var loginTime = sessionStorage.getItem('loginTime');
console.log('Login time: ', loginTime);

// Calculate the elapsed time since the login time
var elapsedTime = new Date().getTime() - loginTime;

// If more than 15 seconds have passed since the login time
if (elapsedTime > 15000) {
    // Clear the session storage
    sessionStorage.clear();
    // Redirect to the login page
    window.location.href = '/Login';
}