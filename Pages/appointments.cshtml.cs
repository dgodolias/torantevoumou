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

        public Dictionary<string, List<int>> ServiceAppointments { get; set; }
        public List<string> ServiceNames { get; set; }
        

        // Change the Users property to a single Appointment
        public List<AppointmentModel>? Appointments { get; set; }
        
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            ServiceNames = HttpContext.Session.GetString("ServiceNames") != null
                ? JsonConvert.DeserializeObject<List<string>>(HttpContext.Session.GetString("ServiceNames"))
                : new List<string>();
            
            Console.WriteLine("serviceappointments" + HttpContext.Session.GetString("ServiceAppointments"));
            
            ServiceAppointments = HttpContext.Session.GetString("ServiceAppointments") != null
                ? JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(HttpContext.Session.GetString("ServiceAppointments"))
                : new Dictionary<string, List<int>>();
            
            

            Appointments = HttpContext.Session.GetString("UserAppointments") != null
                ? JsonConvert.DeserializeObject<List<AppointmentModel>>(HttpContext.Session.GetString("UserAppointments"))
                : new List<AppointmentModel>();
        
            return Page();
        }

        
    }
}