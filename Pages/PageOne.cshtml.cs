using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace YourNamespace
{
    [AllowAnonymous]
    public class PageOneModel : PageModel
    {
        [BindProperty]
        public string InputValue { get; set; }
        public IActionResult OnGet()
        {
            Console.WriteLine($"validSessionPageTwo: {HttpContext.Session.GetString("validSessionPageTwo")}");
            if (HttpContext.Session.GetString("validSessionPageTwo") == "True") return RedirectToPage("/PageTwo");

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            // Console.WriteLine($"validSessionPageTwo: {HttpContext.Session.GetString("validSessionPageTwo")}");
            // if (HttpContext.Session.GetString("validSessionPageTwo") == "true") return RedirectToPage("/PageTwo");

            if (InputValue != null) HttpContext.Session.SetString("InputValue", InputValue);
            if (InputValue != "123") {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            }
            if (InputValue == "123" && HttpContext.Session.GetString("ButtonClicked") == "True") return RedirectToPage("/PageTwo");

            return Page();
        }
    }
}