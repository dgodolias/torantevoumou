using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
            if (!ModelState.IsValid)
            {
                return Page();
            }
            Console.WriteLine($"FirstName: {FirstName}");
            Console.WriteLine($"LastName: {LastName}");
            // Username can only contain Latin, Greek letters or numbers
            var usernameRegex = new Regex(@"^[a-zA-Z0-9]{6,}$");
            // Password must contain at least 8 characters, with at least one letter and one number
            var passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$");
            // Phone number must only contain numbers
            var phoneNumberRegex = new Regex(@"^\d+$");

            bool isValid = true;
    
            if (!usernameRegex.IsMatch(Username))
            {
                Console.WriteLine("Username is invalid");
                ViewData["UsernameError"] = "Username can only contain Latin, Greek letters or numbers.";
                isValid = false;
            }

            if (!passwordRegex.IsMatch(Password))
            {
                Console.WriteLine("Password is invalid");
                ViewData["PasswordError"] = "Password must contain at least 8 characters, with at least one letter and one number.";
                isValid = false;
            }
        
            if (!phoneNumberRegex.IsMatch(PhoneNumber))
            {
                Console.WriteLine("Phone number is invalid");
                ViewData["PhoneNumberError"] = "Phone number must only contain numbers.";
                isValid = false;
            } else {
                PhoneNumber = $"+30{PhoneNumber}";
            }

            bool sthExists = false;
            if (await _firebaseService.UsernameExists(Username))
            {
                Console.WriteLine("Username exists");
                ViewData["UsernameError"] = "Username already exists.";
                sthExists = true;
            }
            if (await _firebaseService.EmailExists(Email)) // Check if the email exists regardless of whether the username exists
            {
                Console.WriteLine("Email exists");
                ViewData["EmailError"] = "Email already exists.";
                sthExists = true;
            }
            
            if (await _firebaseService.PhoneNumberExists(PhoneNumber)) // Check if the phone number exists regardless of whether the username exists
            {
                ViewData["PhoneNumberError"] = "Phone number already exists.";
                sthExists = true;
            }
            
            if (!isValid || sthExists)
            {
                Console.WriteLine("Invalid input");
                return Page();
            }

            User newUser = new User
            {
                FirstName = FirstName,
                LastName = LastName,
                Username = Username,
                Password = Password,
                Email = Email,
                PhoneNumber = PhoneNumber,
                serviceswithappointmentkey = ""
            };

            // Pass the User object to the AddUser method

            await _firebaseService.AddUser(newUser);

            return RedirectToPage("/Login");
        }
    }
}