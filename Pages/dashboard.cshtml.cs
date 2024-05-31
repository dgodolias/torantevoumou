using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

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
        public string? UserIdToken { get; set; }
        public string? UserId { get; set; }
        public User? UserInfo { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId)
        {  
            UserId = userId;
            UserInfo = await _firebaseService.GetUserGENERALinfo(userId);
            HttpContext.Session.SetString("UserGeneralInfo", JsonConvert.SerializeObject(UserInfo));
            Console.WriteLine($"User info: {JsonConvert.SerializeObject(UserInfo)}");
            return Page();
        }
    }
}