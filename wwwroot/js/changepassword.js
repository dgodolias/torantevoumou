
const changePasswordForm = document.querySelector('#change-password-form');
const newPasswordInput = document.querySelector('#new-password');
const confirmPasswordInput = document.querySelector('#confirm-password');

changePasswordForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
        alert('Οι κωδικοί δεν ταιριάζουν.');
        return;
    }

    // Get the user's current email (you'll need to get this from somewhere, 
    // maybe from a session variable or a hidden input field)
    const userEmail = 'user@example.com'; // Replace with actual email

    // Update the user's password using Firebase Authentication
    firebase.auth().currentUser.updatePassword(newPassword)
        .then(() => {
            console.log('Password updated successfully.');
            alert('Ο κωδικός σας άλλαξε επιτυχώς.');
            // Redirect to the login page or another appropriate page
            window.location.href = '/Login';
        })
        .catch(error => {
            console.error('Error updating password:', error);
            alert('Σφάλμα κατά την ενημέρωση του κωδικού σας. Παρακαλούμε δοκιμάστε ξανά.');
        });
});
