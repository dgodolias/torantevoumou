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

// Event listener for form submission
document.querySelector('#login-form').addEventListener('submit', function(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    var email = document.querySelector('#username').value;
    var password = document.querySelector('#password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        // Get the ID token
        user.getIdToken().then((idToken) => {
            // Print the ID token and its type
            console.log("ID token: ", idToken);
            console.log("Type of ID token: ", typeof idToken);
            console.log("User ID: ", user.uid);

            // Send the ID token to the server
            $.ajax({
                url: '/api/SetUserToken',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ idToken: idToken, userId: user.uid }),
                success: function(response) {
                    console.log("Token and user ID sent successfully");
                    // Redirect to the Login page
                    if (response.success) {
                        // If the login time is not set, set it to the current time
                        var loginTime = new Date().getTime();
                        sessionStorage.setItem('loginTime', loginTime);
                        console.log('Login time: ', loginTime);

                        window.location.href = response.redirectUrl;
                    }
                },
                error: function(error) {
                    console.log("Failed to send token and user ID");
                }
            });
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Print the error to the console
        console.log('Error code: ', errorCode, ', Error message: ', errorMessage);
    });
});