using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("UpdateClientAppointment")]
        /*
        public async Task UpdateClientAppointment([FromBody] AppointmentModel appointment)
        {
            Console.WriteLine(appointment);
        
            var result = await _firebaseService.UpdateClientAppointment(appointment);
        
            if (result)
            {
                Console.WriteLine("Appointment updated successfully");
            }
            else
            {
                Console.WriteLine($"Error updating appointment for client with Id {appointment.Id}");
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
    }

    
}

