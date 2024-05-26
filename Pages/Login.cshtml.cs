using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    [AllowAnonymous]
    public class Login : PageModel
    {
        public IActionResult OnGet()
        {
            var validSessionDashboard = HttpContext.Session.GetString("validSessionDashboard");
            var validSessionAdmin = HttpContext.Session.GetString("validSessionAdmin");

            if (validSessionAdmin == "True")
            {
                return RedirectToPage("/Admin");
            }
            else if (validSessionDashboard == "True")
            {
                return RedirectToPage("/Dashboard");
            }
            HttpContext.Session.SetString("validAdminuser", "False");
            HttpContext.Session.SetString("validDashboarduser", "False");
            return Page();
        }
    }
}