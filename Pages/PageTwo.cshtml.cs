using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;

namespace YourNamespace
{
    public class PageTwoModel : PageModel
    {
        public bool ButtonClickedInsideTimespan { get; set; }

        public IActionResult OnGet()
        {
            int time = 15;
            var buttonClickedTime = DateTime.Parse(HttpContext.Session.GetString("ButtonClickedTime") ?? DateTime.MinValue.ToString());
            ButtonClickedInsideTimespan = HttpContext.Session.GetString("ButtonClicked") == "True" && DateTime.UtcNow - buttonClickedTime < TimeSpan.FromSeconds(time);
            
            var InputValue = HttpContext.Session.GetString("InputValue");

            if (DateTime.UtcNow - buttonClickedTime >= TimeSpan.FromSeconds(time))
            {
                HttpContext.Session.SetString("InputValue", string.Empty);
            }

            bool validSessionPageTwo = !string.IsNullOrEmpty(InputValue) && InputValue == "123" && ButtonClickedInsideTimespan;
            int sessiontimeleft = time - (int)(DateTime.UtcNow - buttonClickedTime).TotalSeconds;
            HttpContext.Session.SetString("validSessionPageTwo", validSessionPageTwo.ToString());
            Console.WriteLine($"Valid session page two: {validSessionPageTwo}");
            Console.WriteLine($"Session time left: {sessiontimeleft}");

            if (!ButtonClickedInsideTimespan || string.IsNullOrEmpty(InputValue))
            {
                return RedirectToPage("/PageOne");
            }

            return Page();
        }
    }
}