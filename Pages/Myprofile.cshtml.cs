using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Dapper;

namespace Namespace
{
    public class MyProfile : PageModel
    {
        private readonly IConfiguration _configuration;

        public MyProfile(IConfiguration configuration)
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
            Console.WriteLine($"Username not empty: {usernameNotEmpty}");

            bool validUser = HttpContext.Session.GetString("validuser") == "True";
            Console.WriteLine($"Valid user: {validUser}");

            bool passwordNotEmpty = !string.IsNullOrEmpty(Password);
            Console.WriteLine($"Password not empty: {passwordNotEmpty}");

            Console.WriteLine($"Button clicked inside timespan: {ButtonClickedInsideTimespan}");

            bool validSession = usernameNotEmpty && validUser && passwordNotEmpty && ButtonClickedInsideTimespan;
            HttpContext.Session.SetString("validSession", validSession.ToString());
            Console.WriteLine($"Valid session: {validSession}");

            Console.WriteLine($"Button clicked time: {buttonClickedTime}");
            Console.WriteLine($"Current time: {DateTime.UtcNow}");

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || !validSession)
            {   
                Console.WriteLine("Redirecting to Login");
                return RedirectToPage("/Login");
            }

            // Populate the Appointment property with the necessary data
            Appointment = await GetUserAppointment(Username, Password);

            if (Appointment == null)
            {
                Console.WriteLine("No appointment found for the user.");
            }
            else
            {
                Console.WriteLine($"Appointment date and time: {Appointment.DateTime}");
            }

            return Page();
        }

        private async Task<Appointment?> GetUserAppointment(string username, string password)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            var appointment = await connection.QueryFirstOrDefaultAsync<Appointment>("SELECT appointmentDate AS Date, appointmentTime AS Time FROM Users WHERE Username = @Username AND Password = @Password", new { Username = username, Password = password });

            if (appointment != null)
            {
                // Combine the date from appointment.Date and the time from appointment.Time into a single DateTime
                appointment.DateTime = appointment.Date.Date + appointment.Time;
            }

            return appointment;
        }
    }

    public class Appointment
    {
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public DateTime DateTime { get; set; }
    }
}