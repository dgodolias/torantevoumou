using Google.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace Namespace
{
    public class profile : PageModel
    {
        private readonly FirebaseService _firebaseService;
        
        public profile(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public User? UserProfile { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId)
        {  
            
            if (HttpContext.Session.GetString("UserGeneralInfo") != null)
            {
                // Deserialize the session storage string into a User object
                UserProfile = JsonConvert.DeserializeObject<User>(HttpContext.Session.GetString("UserGeneralInfo"));
            }
            return Page();
        }
        

    }
}