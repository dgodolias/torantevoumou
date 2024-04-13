using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class Appointment
{
    public string UserId { get; set; }
    public string FutureDate { get; set; }
    public string FutureTime { get; set; }
}

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

        [HttpPost("AddClientWithAppointment")]
        public async Task AddClientWithAppointment([FromBody] Appointment appointment)
        {
            Console.WriteLine("Adding client with appointment");
        
            var result = await _firebaseService.UpdateClientAppointment(appointment.UserId, appointment.FutureDate, appointment.FutureTime);
        
            if (result)
            {
                Console.WriteLine("Appointment updated successfully");
            }
            else
            {
                Console.WriteLine($"Error updating appointment for client with Id {appointment.UserId}");
            }
        }
    }

    
}

