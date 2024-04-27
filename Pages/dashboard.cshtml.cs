using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Namespace
{
    public class dashboard : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly FirebaseService _firebaseService;
        
        public dashboard(IConfiguration configuration, FirebaseService firebaseService)
        {
            _configuration = configuration;
            _firebaseService = firebaseService;
        }

        public bool ButtonClickedInsideTimespan { get; set; }

        // Add a new property for the user ID
        public string UserId { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            int time = 60 ;
            var buttonClickedTime = DateTime.Parse(HttpContext.Session.GetString("ButtonClickedTime") ?? DateTime.MinValue.ToString());
            ButtonClickedInsideTimespan = HttpContext.Session.GetString("ButtonClicked") == "True" && DateTime.UtcNow - buttonClickedTime < TimeSpan.FromSeconds(time);
            
            var Username = HttpContext.Session.GetString("Username");
            var Password = HttpContext.Session.GetString("Password");

            if (DateTime.UtcNow - buttonClickedTime >= TimeSpan.FromSeconds(time))
            {
                HttpContext.Session.SetString("Username", string.Empty);
                HttpContext.Session.SetString("Password", string.Empty);
            }

            bool usernameNotEmpty = !string.IsNullOrEmpty(Username);
            bool validDashboardUser = HttpContext.Session.GetString("validDashboarduser") == "True";
            Console.WriteLine($"validDashboardUser: {validDashboardUser}");

            bool passwordNotEmpty = !string.IsNullOrEmpty(Password);
            bool validSession = usernameNotEmpty && validDashboardUser && passwordNotEmpty && ButtonClickedInsideTimespan;
            HttpContext.Session.SetString("validSessionDashboard", validSession.ToString());

            // Get the user's ID from the Firebase service
            var clients = await _firebaseService.GetClients();
            var client = clients.FirstOrDefault(c => (c.Value.Email == Username || c.Value.Username == Username) && c.Value.Password == Password);
            if (client.Value != null)
            {
                UserId = client.Key;
                HttpContext.Session.SetString("UserId", UserId);
            }

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || !validSession)
            {   
                return RedirectToPage("/Login");
            }

            return Page();
        }
    }
}