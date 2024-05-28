using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
        public string UserIdToken { get; set; }
        public string UserId { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            // Get the user ID from the session
            UserIdToken = HttpContext.Session.GetString("IdToken");
            UserId = HttpContext.Session.GetString("UserId");

            // If the user ID is null, redirect to the login page
            if (UserIdToken == null || UserId == null)
            {
                return RedirectToPage("/Login");
            }

            return Page();
        }
    }
}