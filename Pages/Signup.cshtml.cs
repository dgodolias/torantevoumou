using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Namespace
{
    [AllowAnonymous]
    public class SignupModel : PageModel
    {
        private readonly IConfiguration _configuration;

        [BindProperty]
        public string? FirstName { get; set; }
        [BindProperty]
        public string? LastName { get; set; }
        [BindProperty]
        public string? Username { get; set; }
        [BindProperty]
        public string? Password { get; set; }
        [BindProperty]
        public string? Email { get; set; }
        [BindProperty]
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
            #pragma warning disable CS8604 // Possible null reference argument.
            if (IsInputModelValid(FirstName, LastName, Username, Password, Email, PhoneNumber))
            {
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
                if (await PhoneNumberExists(PhoneNumber)) // Check if the email exists regardless of whether the username exists
                {
                    ViewData["PhoneNumberError"] = "PhoneNumber already exists.";
                    sthExists = true;
                }
                if (sthExists)
                {
                    return Page();
                }
                await AddUser(FirstName, LastName, Username, Password, Email, PhoneNumber);
                return RedirectToPage("/Login");
            }
            #pragma warning restore CS8604 // Possible null reference argument.
        
            return Page();
        }

        private bool IsInputModelValid(string firstName, string lastName, string username, string password, string email, string phoneNumber)
        {
            return firstName != null && lastName != null && username != null && password != null && email != null && phoneNumber != null;
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