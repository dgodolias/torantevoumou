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

        public User? UserProfile { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId)
        {  
            // Use the userId in your method
        
            if (HttpContext.Session.GetString("validDashboarduser") != "True")
            {   
                return RedirectToPage("/Login");
            }
        
            // Populate the User property with the necessary data
            UserProfile = await GetUserProfile(userId);
        
            return Page();
        }
        
        private async Task<User?> GetUserProfile(string userId)
        {
            // Get the list of Users from Firebase
            var Users = await _firebaseService.GetUsers();
            
            // Find the User with the matching userId
            var User = Users.FirstOrDefault(c => c.Key == userId);
        
            return User.Value;
        }
    }
}