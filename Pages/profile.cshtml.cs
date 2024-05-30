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
            var userdbinfo = await _firebaseService.GetUserDBinfo(userId); 
            await _firebaseService.GetUserDBinfo(userId); 
            var userauthinfo = await _firebaseService.GetUserAUTHinfo(userId);
            var usergeneralinfo = await _firebaseService.GetUserGENERALinfo(userId);
            Console.WriteLine($"User info: {JsonConvert.SerializeObject(userdbinfo)}");
            Console.WriteLine($"User auth info: {JsonConvert.SerializeObject(userauthinfo)}");
            Console.WriteLine($"User general info: {JsonConvert.SerializeObject(usergeneralinfo)}");
            
        
            return Page();
        }
        

    }
}