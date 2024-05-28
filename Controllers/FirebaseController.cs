using FirebaseAdmin.Auth;
using Google.Api;
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

        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] Dictionary<string, object> changes)
        {
            string? userId = HttpContext.Session.GetString("UserId");
            var result = await _firebaseService.UpdateUser(userId, changes);
        
            if (result)
            {
                return Ok("Update successful!");
            }
            else
            {
                return BadRequest("Update failed. Please try again.");
            }
        }

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

        public class TokenData
        {
            public string IdToken { get; set; }
            public string UserId { get; set; }
        }
        
        [HttpPost("setUserToken")]
        public IActionResult SetToken([FromBody] TokenData data)
        {
            HttpContext.Session.SetString("IdToken", data.IdToken);
            HttpContext.Session.SetString("UserId", data.UserId);
            return Ok(new { success = true, redirectUrl = Url.Page("/Dashboard") });
        }
    }

    
}

