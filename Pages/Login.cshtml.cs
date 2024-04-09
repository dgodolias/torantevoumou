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
            var validSession = HttpContext.Session.GetString("validSession");
            var sessionUsername = HttpContext.Session.GetString("Username");

            if (validSession == "True" && sessionUsername == "admin")
            {
                return RedirectToPage("/Admin");
            }
            else if (validSession == "True")
            {
                return RedirectToPage("/MyProfile");
            }

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            bool validuser = false;
            if (Username != null && Password != null) {
                HttpContext.Session.SetString("Username", Username);
                HttpContext.Session.SetString("Password", Password);
                validuser = await UserExists(Username, Password);
                
            }
            Console.WriteLine(validuser);
            if (!validuser) {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
                Console.WriteLine("Button clicked Time: " + HttpContext.Session.GetString("ButtonClickedTime"));
            }
           
            HttpContext.Session.SetString("validuser", validuser.ToString());

            Console.WriteLine($"validuser: {validuser}");
            Console.WriteLine($"ButtonClicked: {HttpContext.Session.GetString("ButtonClicked")}");
            Console.WriteLine($"Username: {Username}");
            Console.WriteLine($"Password: {Password}"); 
            if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username != "admin" && Password != "123")
            {
                return RedirectToPage("/Myprofile");
            }
            else if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username == "admin" && Password == "123")
            {
                return RedirectToPage("/Admin");
            }

            return Page();
        }

        private async Task<bool> UserExists(string username, string password)
        {
            if (Username == "admin" && Password == "123") return true;
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var user = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Appointments WHERE Username = @Username AND Password = @Password", new { Username = username, Password = password });

            return user != null;
        }
    }
}