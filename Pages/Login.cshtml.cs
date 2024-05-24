using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

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

        private FirebaseService _firebaseService;

    public Login(IConfiguration configuration, FirebaseService firebaseService)
    {
        _configuration = configuration;
        _firebaseService = firebaseService;
    }

        public IActionResult OnGet()
        {
            var validSessionDashboard = HttpContext.Session.GetString("validSessionDashboard");
            var validSessionAdmin = HttpContext.Session.GetString("validSessionAdmin");

            if (validSessionAdmin == "True")
            {
                return RedirectToPage("/Admin");
            }
            else if (validSessionDashboard == "True")
            {
                return RedirectToPage("/Dashboard");
            }
            HttpContext.Session.SetString("validAdminuser", "False");
            HttpContext.Session.SetString("validDashboarduser", "False");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            bool validAdminuser = false;
            bool validDashboarduser = false;
            if (Username != null && Password != null) {
                HttpContext.Session.SetString("Username", Username);
                HttpContext.Session.SetString("Password", Password);
                validDashboarduser = await UserExists(Username, Password);
                validAdminuser = Username == "admin" && Password == "123";
                
            }

            bool validuser = validDashboarduser || validAdminuser;

            if (!validuser) {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            }
           

            if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username != "admin")
            {
                HttpContext.Session.SetString("validAdminuser", validAdminuser.ToString());
                HttpContext.Session.SetString("validDashboarduser", validDashboarduser.ToString());
                return RedirectToPage("/Dashboard");
            }
            else if (validuser && HttpContext.Session.GetString("ButtonClicked") == "True" && Username == "admin" && Password == "123")
            {
                HttpContext.Session.SetString("validAdminuser", validAdminuser.ToString());
                HttpContext.Session.SetString("validDashboarduser", validDashboarduser.ToString());
                return RedirectToPage("/Admin");
            }
            
            return Page();
        }

        private async Task<bool> UserExists(string username, string password)
        {
            var users = await _firebaseService.GetUsers();
            // Print all users to the console
        
            var user = users.FirstOrDefault(user => user.Value.Username == username && user.Value.Password == password);
            
            return user.Value != null;
        }
    }
}