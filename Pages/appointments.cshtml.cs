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

        public List<User>? Users { get; set; }
        public List<User>? ServiceAppointments { get; set; }
        public List<string> ServiceNames { get; set; }
        

        // Change the Users property to a single Appointment
        public List<AppointmentModel>? Appointments { get; set; }
        
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            User user = await _firebaseService.GetUserInfo(userId);
        
            // Extract service names from the user's serviceswithappointmentkey
            ServiceNames = user.serviceswithappointmentkey.Split('#')
                .Select(s => s.Split('(')[0])
                .ToList();
        
            return Page();
        }
        /*
        private async Task<List<AppointmentModel>> GetUserAppointments(string userId)
        {
            // Get the dictionary of Users from Firebase
            var UsersDictionary = await _firebaseService.GetUsers();
        
            // Find the User with the matching ID
            var User = UsersDictionary.FirstOrDefault(c => c.Key == userId);
        
            var appointments = new List<AppointmentModel>();
        
            if (User.Value != null)
            {
                var servicesWithAppointmentKey = User.Value.serviceswithappointmentkey;
                // Split the servicesWithAppointmentKey string into individual services
                var services = servicesWithAppointmentKey.Split('#');
        
                foreach (var service in services)
                {
                    // Split the service string into the service name and the appointment keys
                    var serviceParts = service.Split('(');
                    var serviceName = serviceParts[0];
                    var appointmentKeys = serviceParts[1].TrimEnd(')').Split(',');
        
                    foreach (var appointmentKey in appointmentKeys)
                    {
                        // Get the appointment from the service table in Firebase
                        var appointment = await _firebaseService.GetAppointment(serviceName, appointmentKey);
        
                        if (appointment != null)
                        {
                            appointments.Add(appointment);
                        }
                    }
                }
            }
        
            return appointments;
        }

        */
    }
}