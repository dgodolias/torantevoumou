// Firebase configuration
const firebaseConfig = {
    // ... your Firebase config ...
};
firebase.initializeApp(firebaseConfig);

const forgotPasswordForm = document.querySelector('#forgot-password-form');
const loaderElement = document.querySelector('.loader');

// Function to show the loading indicator
function showLoader() {
    loaderElement.style.display = 'flex';
}

// Function to hide the loading indicator
function hideLoader() {
    loaderElement.style.display = 'none';
}

// Function to handle forgot password form submission
async function handleForgotPasswordSubmit(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;

    // Input validation (add more checks as needed)
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    showLoader();

    try {
        // Send password reset email
        const actionCodeSettings = {
            url: window.location.origin + '/ResetPassword',
            handleCodeInApp: true
        };

        const auth = firebase.auth();
        await auth.sendSignInLinkToEmail(email, actionCodeSettings);

        hideLoader();
        alert('Verification email sent successfully. Please check your inbox.');
    } catch (error) {
        hideLoader();
        console.error('Error sending password reset email:', error);
        alert('Failed to send verification email. Please try again.');
    }
}

// Function to validate email (add more robust validation as needed)
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Event listeners
forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
