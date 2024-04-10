using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Dapper;

namespace Namespace
{
    public class Myprofile : PageModel
    {
        private readonly IConfiguration _configuration;

        public Myprofile(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool ButtonClickedInsideTimespan { get; set; }

        // Change the Users property to a single Appointment
        public Appointment? Appointment { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            int time = 15;
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

            bool validUser = HttpContext.Session.GetString("validuser") == "True";

            bool passwordNotEmpty = !string.IsNullOrEmpty(Password);

            bool validSession = usernameNotEmpty && validUser && passwordNotEmpty && ButtonClickedInsideTimespan;
            HttpContext.Session.SetString("validSession", validSession.ToString());

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || !validSession)
            {   
                Console.WriteLine("Redirecting to Login");
                return RedirectToPage("/Login");
            }

            // Populate the Appointment property with the necessary data
            Appointment = await GetUserAppointment(Username, Password);

            return Page();
        }

        private async Task<Appointment?> GetUserAppointment(string username, string password)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var appointment = await connection.QueryFirstOrDefaultAsync<Appointment>("SELECT appointmentDate AS Date, appointmentTime AS Time FROM Users WHERE Username = @Username AND Password = @Password", new { Username = username, Password = password });

            if (appointment != null)
            {

                var dates = appointment.Date?.Split('#').Where(date => !string.IsNullOrWhiteSpace(date)).ToArray();
                var times = appointment.Time?.Split('#').Where(time => !string.IsNullOrWhiteSpace(time)).ToArray();

                // Initialize the DateTime list
                appointment.DateTime = new List<DateTime>();

                // Combine each date and time into a single DateTime and add it to the list
                if (dates != null && times != null)
                {
                    // Combine each date and time into a single DateTime and add it to the list
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
            }

            return appointment;
        }
    }

    public class Appointment
    {
        public string? Date { get; set; }
        public string? Time { get; set; }
        public List<DateTime>? DateTime { get; set; }
    }
}