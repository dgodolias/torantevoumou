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
    
        // Add a new property for the user ID
        public string? UserId { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId)
        {  
            UserId = userId;
            return Page();
        }
    }
}