public class AppointmentModel
{
    public string Id { get; set; }
    public string? Date { get; set; }
    public string? Time { get; set; }
    public List<DateTime>? DateTime { get; set; }
}