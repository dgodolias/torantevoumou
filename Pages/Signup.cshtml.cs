using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;

namespace Namespace
{
    [AllowAnonymous]
    public class SignupModel : PageModel
    {
        private readonly IConfiguration _configuration;

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

        public SignupModel(IConfiguration configuration)
        {
            _configuration = configuration;
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

            // Username can only contain Latin, Greek letters or numbers
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
            }

            if (!passwordRegex.IsMatch(Password))
            {
                ViewData["PasswordError"] = "Password must contain at least 8 characters, with at least one letter and one number.";
                isValid = false;
            }

            if (!phoneNumberRegex.IsMatch(PhoneNumber))
            {
                ViewData["PhoneNumberError"] = "Phone number must only contain numbers.";
                isValid = false;
            }

            bool sthExists = false;
            if (await UsernameExists(Username))
            {
                ViewData["UsernameError"] = "Username already exists.";
                sthExists = true;
            }
            if (await EmailExists(Email)) // Check if the email exists regardless of whether the username exists
            {
                ViewData["EmailError"] = "Email already exists.";
                sthExists = true;
            }
            if (await PhoneNumberExists(PhoneNumber)) // Check if the phone number exists regardless of whether the username exists
            {
                ViewData["PhoneNumberError"] = "Phone number already exists.";
                sthExists = true;
            }

            if (!isValid || sthExists)
            {
                return Page();
            }

            await AddUser(FirstName, LastName, Username, Password, Email, PhoneNumber);
            return RedirectToPage("/Login");
        }

        private async Task<bool> UsernameExists(string username)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var existingUser = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Users WHERE username = @Username", new { Username = username });

            return (existingUser != null) || (username == "admin");
        }

        private async Task<bool> EmailExists(string email)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var existingUser = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Users WHERE Email = @Email", new { Email = email });

            return existingUser != null;
        }
        private async Task<bool> PhoneNumberExists(string phoneNumber)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var existingUser = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Users WHERE PhoneNumber = @PhoneNumber", new { PhoneNumber = phoneNumber });

            return existingUser != null;
        }

        private async Task AddUser(string firstName, string lastName, string username, string password, string email, string phoneNumber)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));

            var maxId = await connection.QueryFirstOrDefaultAsync<int>("SELECT MAX(id) FROM Users");
            var newId = maxId + 1;

            Console.WriteLine($"New User ID: {newId}");

            await connection.ExecuteAsync("INSERT INTO Users (id, firstName, lastName, username, password, email, phoneNumber, appointmentDate, appointmentTime) VALUES (@Id, @FirstName, @LastName, @Username, @Password, @Email, @PhoneNumber, @AppointmentDate, @AppointmentTime)",
                new { Id = newId, FirstName = firstName, LastName = lastName, Username = username, Password = password, Email = email, PhoneNumber = phoneNumber, AppointmentDate = (string)null, AppointmentTime = (string)null });
        }
    }
}