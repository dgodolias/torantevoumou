// Read the config.json file
fetch('../config.json') // Use '../' to go up one level from \wwwroot\js\ to the root
  .then(response => response.json())
  .then(data => {
    // Extract the firebaseConfig object from the data
    const firebaseConfig = data.firebaseConfig;

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Now you can use Firebase services
    console.log('Firebase initialized successfully!');
  })
  .catch(error => {
    console.error('Error reading config.json:', error);
  });
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

    const auth = firebase.auth();
    auth.sendSignInLinkToEmail(email, {
        url: window.location.origin + '/ResetPassword', // Your redirect URL
        handleCodeInApp: true // Handle the code in your app
    })
    .then(() => {
        console.log('Password reset email sent successfully.');
        alert('Password reset email sent successfully. Please check your inbox.');
    })
    .catch(error => {
        console.error('Error sending password reset email:', error);
        alert('Failed to send password reset email. Please try again.');
    });
    
});
