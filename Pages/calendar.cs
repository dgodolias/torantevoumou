using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class CalendarController : Controller
{
    [HttpPost]
    public ActionResult Index()
    {
        using (var reader = new StreamReader(Request.Body))
        {
            var json = reader.ReadToEnd();
            var data = JsonConvert.DeserializeObject<dynamic>(json);

            var date = data.date;
            var time = data.time;
            Console.WriteLine($"Date: {date}, Time: {time}");
            // TODO: Add code here to communicate with the server

            return Json(new { success = true });
        }
    }
}