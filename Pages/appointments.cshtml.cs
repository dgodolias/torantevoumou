using Google.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace Namespace
{
    public class appointments : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly FirebaseService _firebaseService;
        
        public appointments(IConfiguration configuration, FirebaseService firebaseService)
        {
            _configuration = configuration;
            _firebaseService = firebaseService;
        }

        // Updated the type of ServiceAppointments to match the new function requirement
        public Dictionary<string, List<string>> ServiceAppointments { get; set; }
        public List<string> ServiceNames { get; set; }
        

        // Change the Users property to a single Appointment
        public List<AppointmentModel>? Appointments { get; set; }
        
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            ServiceNames = HttpContext.Session.GetString("ServiceNames") != null
                ? JsonConvert.DeserializeObject<List<string>>(HttpContext.Session.GetString("ServiceNames"))
                : new List<string>();
            

            
            // Updated the deserialization to match the new type of ServiceAppointments
            ServiceAppointments = HttpContext.Session.GetString("ServiceJustKeysAppointments") != null
                ? JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(HttpContext.Session.GetString("ServiceJustKeysAppointments"))
                : new Dictionary<string, List<string>>();
            
            

            Appointments = HttpContext.Session.GetString("UserDetailedAppointments") != null
                ? JsonConvert.DeserializeObject<List<AppointmentModel>>(HttpContext.Session.GetString("UserDetailedAppointments"))
                : new List<AppointmentModel>();
            Console.WriteLine("appointments" + HttpContext.Session.GetString("UserDetailedAppointments"));
        
            return Page();
        }

        
    }
}