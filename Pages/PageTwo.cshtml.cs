using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;

namespace YourNamespace
{
    public class PageTwoModel : PageModel
    {
        public bool ButtonClicked { get; set; }

        public IActionResult OnGet()
        {
            var buttonClickedTime = DateTime.Parse(HttpContext.Session.GetString("ButtonClickedTime") ?? DateTime.MinValue.ToString());
            ButtonClicked = HttpContext.Session.GetString("ButtonClicked") == "true" && DateTime.UtcNow - buttonClickedTime < TimeSpan.FromMinutes(30);

            if (!ButtonClicked)
            {
                return RedirectToPage("/PageOne");
            }

            return Page();
        }
    }
}