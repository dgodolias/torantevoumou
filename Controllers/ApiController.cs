using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Namespace.Controllers
{
    [Route("api")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ApiController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class UpdateAppointmentModel
        {
            public int userId { get; set; }
            public string appointmentDate { get; set; }
            public string appointmentTime { get; set; }
        }

        [HttpPost("updateAppointment")]
        public async Task<IActionResult> UpdateAppointment([FromBody] UpdateAppointmentModel model)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("MyDbConnection"));
            await connection.ExecuteAsync("UPDATE Users SET appointmentDate = COALESCE(appointmentDate, @FutureDate), appointmentTime = COALESCE(appointmentTime, @FutureTime) WHERE Id = @UserId", new { UserId = model.userId, FutureDate = model.appointmentDate, FutureTime = model.appointmentTime });
            return Ok();
        }
    }
}