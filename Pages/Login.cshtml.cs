using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace YourNamespace
{
    [AllowAnonymous]
    public class Login : PageModel
    {
        private readonly IConfiguration _configuration;

        [BindProperty]
        public string? Username { get; set; }
        [BindProperty]
        public string? Password { get; set; }

        public Login(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult OnGet()
        {
            if (HttpContext.Session.GetString("validSessionPageTwo") == "True") return RedirectToPage("/Admin");

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            if (Username != null && Password != null) {
                HttpContext.Session.SetString("Username", Username);
                HttpContext.Session.SetString("Password", Password);
            }
            if (Username != "admin" && Password != "123") {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            }
            if (Password == "123" && Username == "admin" && HttpContext.Session.GetString("ButtonClicked") == "True") return RedirectToPage("/Admin");

            if (await UserExists(Username, Password))
            {
                return RedirectToPage("/Myprofile");
            }
            else
            {
                // User doesn't exist, handle accordingly
            }

            return Page();
        }

        private async Task<bool> UserExists(string username, string password)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var user = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Appointments WHERE Username = @Username AND Password = @Password", new { Username = username, Password = password });

            return user != null;
        }
    }
}