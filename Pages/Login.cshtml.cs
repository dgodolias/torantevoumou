using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    [AllowAnonymous]
    public class Login : PageModel
    {
        public IActionResult OnPost()
        {
            var UserIdToken = HttpContext.Session.GetString("IdToken");
            var validSessionAdmin = HttpContext.Session.GetString("validSessionAdmin");
            Console.WriteLine($"UserIdToken: {UserIdToken}");
            if (validSessionAdmin == "True")
            {
                return RedirectToPage("/Admin");
            }
            else if (UserIdToken != null)
            {
                Console.WriteLine("Redirecting to dashboard");
                return RedirectToPage("/Dashboard");
            }
            HttpContext.Session.SetString("validAdminuser", "False");
            return Page();
        }
    }
}