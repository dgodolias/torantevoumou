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
        public List<User>? ServiceAppointments { get; set; }
        public List<string> ServiceNames { get; set; }
        public List<AppointmentModel>? Appointments { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId)
        {  
            UserId = userId;
            UserInfo = await _firebaseService.GetUserGENERALinfo(userId);
            HttpContext.Session.SetString("UserGeneralInfo", JsonConvert.SerializeObject(UserInfo));

            // Extract service names from the user's serviceswithappointmentkey
            ServiceNames = UserInfo.serviceswithappointmentkey.Split('#')
                .Where(s => !string.IsNullOrEmpty(s) && s.Contains('('))
                .Select(s => s.Split('(')[0])
                .ToList();
            HttpContext.Session.SetString("ServiceNames", JsonConvert.SerializeObject(ServiceNames));

            // Extract service names and appointment IDs from the user's serviceswithappointmentkey
            Dictionary<string, List<int>> serviceAppointments = new Dictionary<string, List<int>>();
            string[] services = UserInfo.serviceswithappointmentkey.Split('#');
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
            HttpContext.Session.SetString("ServiceAppointments", JsonConvert.SerializeObject(serviceAppointments));

            // Pass the dictionary to the GetUserAppointments method
            Appointments = await _firebaseService.GetUserAppointments(serviceAppointments);
            HttpContext.Session.SetString("UserAppointments", JsonConvert.SerializeObject(Appointments));

            return Page();
        }
    }
}