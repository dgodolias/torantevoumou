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
                .Where(s => !string.IsNullOrEmpty(s) && s.Contains('('))
                .Select(s => s.Split('(')[0])
                .ToList();
        
            // Extract service names and appointment IDs from the user's serviceswithappointmentkey
            Dictionary<string, List<int>> serviceAppointments = new Dictionary<string, List<int>>();
            string[] services = user.serviceswithappointmentkey.Split('#');
            foreach (string service in services)
            {
                if (!string.IsNullOrEmpty(service) && service.Contains('('))
                {
                    string[] parts = service.Split('(');
                    string serviceName = parts[0];
                    string[] appointmentIds = parts[1].TrimEnd(')').Split(',');
                    List<int> appointmentIdList = appointmentIds.Select(int.Parse).ToList();
                    serviceAppointments.Add(serviceName, appointmentIdList);
                }
            }
        
            // Pass the dictionary to the GetUserAppointments method
            Appointments = await _firebaseService.GetUserAppointments(serviceAppointments);
        
            return Page();
        }

        
    }
}