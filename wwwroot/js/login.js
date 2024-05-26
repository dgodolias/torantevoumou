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

    // Authenticate the user
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // User exists, redirect to the dashboard
            window.location.href = "/Dashboard";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // Show an error message
            alert(errorMessage);
        });
});