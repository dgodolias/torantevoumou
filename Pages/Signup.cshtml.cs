using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;

namespace Namespace
{
    [AllowAnonymous]
    public class SignupModel : PageModel
    {
        private readonly FirebaseService _firebaseService;

        [BindProperty, Required(ErrorMessage = "First name is required.")]
        public string? FirstName { get; set; }
        [BindProperty, Required(ErrorMessage = "Last name is required.")]
        public string? LastName { get; set; }
        [BindProperty, Required(ErrorMessage = "Username is required.")]
        public string? Username { get; set; }
        [BindProperty, Required(ErrorMessage = "Password is required.")]
        public string? Password { get; set; }
        [BindProperty, Required(ErrorMessage = "Email is required.")]
        public string? Email { get; set; }
        [BindProperty, Required(ErrorMessage = "Phone number is required.")]
        public string? PhoneNumber { get; set; }

        public SignupModel(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            Console.WriteLine("OnPostAsync started");

            if (!ModelState.IsValid)
            {
                Console.WriteLine("Model state is not valid");
                return Page();
            }

            // Username can only contain Latin, Greek letters or numbers and at least 6 words
            var usernameRegex = new Regex(@"^[a-zA-Z0-9]{6,}$");
            // Password must contain at least 8 characters, with at least one letter and one number
            var passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$");
            // Phone number must only contain numbers
            var phoneNumberRegex = new Regex(@"^\d+$");

            bool isValid = true;

            if (!usernameRegex.IsMatch(Username))
            {
                ViewData["UsernameError"] = "Username can only contain Latin, Greek letters or numbers.";
                isValid = false;
                Console.WriteLine("Username is not valid");
            }

            if (!passwordRegex.IsMatch(Password))
            {
                ViewData["PasswordError"] = "Password must contain at least 8 characters, with at least one letter and one number.";
                isValid = false;
                Console.WriteLine("Password is not valid");
            }

            if (!phoneNumberRegex.IsMatch(PhoneNumber))
            {
                ViewData["PhoneNumberError"] = "Phone number must only contain numbers.";
                isValid = false;
                Console.WriteLine("Phone number is not valid");
            }

            bool sthExists = false;
            if (await _firebaseService.UsernameExists(Username))
            {
                ViewData["UsernameError"] = "Username already exists.";
                sthExists = true;
                Console.WriteLine("Username already exists");
            }
            if (await _firebaseService.EmailExists(Email)) // Check if the email exists regardless of whether the username exists
            {
                ViewData["EmailError"] = "Email already exists.";
                sthExists = true;
                Console.WriteLine("Email already exists");
            }
            if (await _firebaseService.PhoneNumberExists(PhoneNumber)) // Check if the phone number exists regardless of whether the username exists
            {
                ViewData["PhoneNumberError"] = "Phone number already exists.";
                sthExists = true;
                Console.WriteLine("Phone number already exists");
            }

            if (!isValid || sthExists)
            {
                Console.WriteLine("Returning due to invalid input or existing data");
                return Page();
            }

            await _firebaseService.AddUser(FirstName, LastName, Username, Password, Email, PhoneNumber);
            Console.WriteLine("User added successfully");
            return RedirectToPage("/Login");
        }
    }
}