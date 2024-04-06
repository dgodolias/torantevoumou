using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace YourNamespace
{
    [AllowAnonymous]
    public class PageOneModel : PageModel
    {
        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            HttpContext.Session.SetString("ButtonClicked", "true");
            HttpContext.Session.SetString("ButtonClickedTime", DateTime.UtcNow.ToString());
            return RedirectToPage("/PageTwo");
        }
        
    }
}