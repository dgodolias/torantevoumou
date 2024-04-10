using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Namespace
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
            var validSessionMyprofile = HttpContext.Session.GetString("validSessionMyprofile");
            var validSessionAdmin = HttpContext.Session.GetString("validSessionAdmin");

            if (validSessionAdmin == "True")
            {
                return RedirectToPage("/Admin");
            }
            else if (validSessionMyprofile == "True")
            {
                return RedirectToPage("/Myprofile");
            }
            HttpContext.Session.SetString("validAdminuser", "False");
            HttpContext.Session.SetString("validMyprofileuser", "False");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            bool validAdminuser = false;
            bool validMyprofileuser = false;
            if (Username != null && Password != null) {
                HttpContext.Session.SetString("Username", Username);
                HttpContext.Session.SetString("Password", Password);
                validMyprofileuser = await UserExists(Username, Password);
                validAdminuser = Username == "admin" && Password == "123";
                
            }

            bool validuser = validMyprofileuser || validAdminuser;

            if (!validuser) {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            }
           

            if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username != "admin" && Password != "123")
            {
                HttpContext.Session.SetString("validAdminuser", validAdminuser.ToString());
                HttpContext.Session.SetString("validMyprofileuser", validMyprofileuser.ToString());
                return RedirectToPage("/Myprofile");
            }
            else if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username == "admin" && Password == "123")
            {
                HttpContext.Session.SetString("validAdminuser", validAdminuser.ToString());
                HttpContext.Session.SetString("validMyprofileuser", validMyprofileuser.ToString());
                return RedirectToPage("/Admin");
            }

            return Page();
        }

        private async Task<bool> UserExists(string username, string password)
        {
            
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var user = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Users WHERE Username = @Username AND Password = @Password", new { Username = username, Password = password });

            return user != null;
        }
    }
}