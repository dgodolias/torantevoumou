using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Namespace
{
    public class Admin : PageModel
    {
        private readonly FirebaseService _firebaseService;

        public Admin(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public bool ButtonClickedInsideTimespan { get; set; }

        // Add the Clients property
        public List<Client>? Clients { get; set; }

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

            bool validSession = !string.IsNullOrEmpty(Username) && Username == "admin" && !string.IsNullOrEmpty(Password) && Password == "123" && ButtonClickedInsideTimespan;
            HttpContext.Session.SetString("validSessionAdmin", validSession.ToString());

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || !validSession)
            {
                return RedirectToPage("/Login");
            }

            // Populate the Clients property with the necessary data
            Clients = await _firebaseService.GetClients();

            return Page();
        }
    }
}