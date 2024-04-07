using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace YourNamespace
{
    [AllowAnonymous]
    public class AdminLogin : PageModel
    {
        [BindProperty]
        public string Username { get; set; }
        [BindProperty]
        public string Password { get; set; }
        public IActionResult OnGet()
        {
            if (HttpContext.Session.GetString("validSessionPageTwo") == "True") return RedirectToPage("/Admin");

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {   
            // Console.WriteLine($"validSessionPageTwo: {HttpContext.Session.GetString("validSessionPageTwo")}");
            // if (HttpContext.Session.GetString("validSessionPageTwo") == "true") return RedirectToPage("/PageTwo");

            if (Username != null && Password != null) {
                HttpContext.Session.SetString("Username", Username);
                HttpContext.Session.SetString("Password", Password);
            }
            if (Username != "admin" && Password != "123") {
                HttpContext.Session.SetString("ButtonClicked", "False");
            } else {
                HttpContext.Session.SetString("ButtonClicked", "True");
                HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            }
            if (Password == "123" && Username == "admin" && HttpContext.Session.GetString("ButtonClicked") == "True") return RedirectToPage("/Admin");

            return Page();
        }
    }
}