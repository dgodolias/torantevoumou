const firebaseConfig = {
    apiKey: "AIzaSyBmSJlgs_5jVU1CdD9002fdhT9GCld75EM",
    authDomain: "torantevoumou-86820.firebaseapp.com",
    databaseURL: "https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "torantevoumou-86820",
    storageBucket: "torantevoumou-86820.appspot.com",
    messagingSenderId: "249720175444",
    appId: "1:249720175444:web:ef072577d5879e7a4d26c1",
    measurementId: "G-2LXMRZZBRW"
};
firebase.initializeApp(firebaseConfig);

if (sessionStorage.getItem('userLoggedIn') === 'true') {
    // Redirect to the dashboard page
    window.location.href = '/Dashboard';
}

// Event listener for form submission
document.querySelector('#login-form').addEventListener('submit', function(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        // Get the ID token
        user.getIdToken().then((idToken) => {

            // Store the ID token and user ID in the session storage
            sessionStorage.setItem('IdToken', idToken);
            sessionStorage.setItem('UserId', user.uid);
            // Set the userLoggedIn flag to true
            sessionStorage.setItem('userLoggedIn', 'true');

            // If the login time is not set, set it to the current time
            var loginTime = new Date().getTime();
            sessionStorage.setItem('loginTime', loginTime);
            console.log('Login time: ', loginTime);

            // Redirect to the Dashboard page
            window.location.href = '/Dashboard';
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Print the error to the console
        console.log('Error code: ', errorCode, ', Error message: ', errorMessage);
    });
});
