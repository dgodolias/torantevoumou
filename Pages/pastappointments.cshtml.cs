using Google.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace Namespace
{
    public class pastAppointments : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly FirebaseService _firebaseService;
        
        public pastAppointments(IConfiguration configuration, FirebaseService firebaseService)
        {
            _configuration = configuration;
            _firebaseService = firebaseService;
        }

        // Updated the type of ServicepastAppointments to match the new function requirement
        public Dictionary<string, List<string>> ServicepastAppointments { get; set; }
        public List<string> ServiceNames { get; set; }
        

        // Change the Users property to a single Appointment
        public List<AppointmentModel>? PastAppointments { get; set; }
        
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            ServiceNames = HttpContext.Session.GetString("ServiceNames") != null
                ? JsonConvert.DeserializeObject<List<string>>(HttpContext.Session.GetString("ServiceNames"))
                : new List<string>();
            Console.WriteLine(ServiceNames);
                
        
            return Page();
        }

        
    }
}