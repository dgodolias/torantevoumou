using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class profile : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly FirebaseService _firebaseService;
        
        public profile(IConfiguration configuration, FirebaseService firebaseService)
        {
            _configuration = configuration;
            _firebaseService = firebaseService;
        }

        public Client? UserProfile { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {  
            var Username = HttpContext.Session.GetString("Username");
            var Password = HttpContext.Session.GetString("Password");

            if (HttpContext.Session.GetString("validDashboarduser") != "True")
            {   
                return RedirectToPage("/Login");
            }

            // Populate the User property with the necessary data
            UserProfile = await GetUserProfile(Username, Password);

            return Page();
        }

        private async Task<Client?> GetUserProfile(string username, string password)
        {
            // Get the list of clients from Firebase
            var clients = await _firebaseService.GetClients();
        
            // Find the client with the matching username and password
            var client = clients.FirstOrDefault(c => (c.Value.Email == username || c.Value.Username == username) && c.Value.Password == password);

            return client.Value;
        }
    }
}