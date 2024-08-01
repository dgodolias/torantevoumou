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

// Get the loader element
const loaderElement = document.querySelector('.loader');

// Event listener for form submission
document.querySelector('#login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    loaderElement.style.display = 'flex';

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        user.getIdToken().then((idToken) => {
            sessionStorage.setItem('IdToken', idToken);
            sessionStorage.setItem('UserId', user.uid);
            sessionStorage.setItem('userLoggedIn', 'true');
            var loginTime = new Date().getTime();
            sessionStorage.setItem('loginTime', loginTime);
            if (user.uid) {
                window.location.href = '/Dashboard?userId=' + user.uid;
            } else {
                console.log('User ID is not defined');
            }
        });
    })
    .catch((error) => {
        loaderElement.style.display = 'none';
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error code: ', errorCode, ', Error message: ', errorMessage);
    });
});

// Event listener for forgot password link
document.querySelector('#forgot-password').addEventListener('click', function(event) {
    event.preventDefault();

    var email = document.querySelector('#email').value;
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/sendVerificationEmail', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email }),
    mode: 'no-cors' // Disable CORS checks
    })
    .then(response => {
    // You can't access response.text() or response.json() here
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // You can only check response.ok to see if the request was successful
    alert('Verification email sent successfully. Please check your inbox.');
    })
    .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    alert('Failed to send verification email. Please try again.');
    });

});