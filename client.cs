namespace Namespace{
    public class Client
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string? Username { get; set; } // Add this line
        public string? Password { get; set; } // Add this line
        public string? Email { get; set; } // Add this line
        public string? PhoneNumber { get; set; } // Add this line
    }
}
