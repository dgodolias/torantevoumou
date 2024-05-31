using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Namespace
{

    [Route("api")]
    [ApiController]
    public class FirebaseController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;

        public FirebaseController(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        [HttpPost("UpdateUserAppointment")]
        /*
        public async Task UpdateUserAppointment([FromBody] AppointmentModel appointment)
        {
            Console.WriteLine(appointment);
        
            var result = await _firebaseService.UpdateUserAppointment(appointment);
        
            if (result)
            {
                Console.WriteLine("Appointment updated successfully");
            }
            else
            {
                Console.WriteLine($"Error updating appointment for User with Id {appointment.Id}");
            }
        }
        */



        [HttpPost("SetSelectedService")]
        public IActionResult SetSelectedService([FromBody] string service)
        {
            // Store the selected service in a session variable
            HttpContext.Session.SetString("selectedService", service);
        
            return Ok(new { success = true });
        }

        [HttpGet("GetServiceAppointments/{serviceName}")]
        public async Task<List<AppointmentModel>> GetServiceAppointments(string serviceName)
        {
            using (var httpUser = new HttpClient())
            {
                var firebaseUrl = $"https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/services/{serviceName}.json";
                var json = await httpUser.GetStringAsync(firebaseUrl);
                Console.WriteLine("Json:"+json);
                var ServiceList = JsonConvert.DeserializeObject<List<AppointmentModel>>(json);

                // Print each item in the list
                foreach (var appointment in ServiceList)
                {
                    Console.WriteLine("Appointment: " + JsonConvert.SerializeObject(appointment));
                }

                return ServiceList;
            }
        }

        [HttpPost("ClearSession")]
        public IActionResult ClearSession()
        {
            HttpContext.Session.Clear();
            Console.WriteLine("Session cleared");
            return Ok(new { message = "Session cleared" });
        }
    }

    
}

