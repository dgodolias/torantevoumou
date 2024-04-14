using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Namespace
{
    public class Myprofile : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly FirebaseService _firebaseService;
        
        public Myprofile(IConfiguration configuration, FirebaseService firebaseService)
        {
            _configuration = configuration;
            _firebaseService = firebaseService;
        }

        public bool ButtonClickedInsideTimespan { get; set; }
        public List<Client>? Clients { get; set; }

        // Change the Users property to a single Appointment
        public Appointment? Appointment { get; set; }

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

            bool usernameNotEmpty = !string.IsNullOrEmpty(Username);
            bool validMyprofileUser = HttpContext.Session.GetString("validMyprofileuser") == "True";
            Console.WriteLine($"validMyprofileUser: {validMyprofileUser}");

            bool passwordNotEmpty = !string.IsNullOrEmpty(Password);
            bool validSession = usernameNotEmpty && validMyprofileUser && passwordNotEmpty && ButtonClickedInsideTimespan;
            HttpContext.Session.SetString("validSessionMyprofile", validSession.ToString());

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || !validSession)
            {   
                return RedirectToPage("/Login");
            }

            // Populate the Appointment property with the necessary data
            Appointment = await GetUserAppointment(Username, Password);
            var clientsDictionary = await _firebaseService.GetClients();
            Clients = clientsDictionary.Values.ToList();

            return Page();
        }

        private async Task<Appointment?> GetUserAppointment(string username, string password)
        {
            // Get the list of clients from Firebase
            var clients = await _firebaseService.GetClients();
        
            // Find the client with the matching username and password
            var client = clients.FirstOrDefault(c => (c.Value.Email == username || c.Value.Username == username) && c.Value.Password == password);

            if (client.Value != null)
            {
                var appointment = new Appointment
                {
                    Id = client.Key,
                    Date = client.Value.AppointmentDate,
                    Time = client.Value.AppointmentTime
                };

                var dates = appointment.Date?.Split('#').Where(date => !string.IsNullOrWhiteSpace(date)).ToArray();
                var times = appointment.Time?.Split('#').Where(time => !string.IsNullOrWhiteSpace(time)).ToArray();
        
                // Initialize the DateTime list
                appointment.DateTime = new List<DateTime>();
                Console.WriteLine($"check11");
                // Combine each date and time into a single DateTime and add it to the list
                if (dates != null && times != null)
                {
                    for (int i = 0; i < dates.Length; i++)
                    {
                        if (!string.IsNullOrWhiteSpace(dates[i]) && !string.IsNullOrWhiteSpace(times[i]) && dates[i] != "NULL" && times[i] != "NULL")
                        {
                            Console.WriteLine($"Date: {dates[i]}, Time: {times[i]}"); // Print the date and time
        
                            var date = DateTime.Parse(dates[i]);
                            var time = TimeSpan.Parse(times[i]);
                            appointment.DateTime.Add(date.Date + time);
                        }
                    }
                }
                return appointment;
            }
        
            return null;
        }
    }

}