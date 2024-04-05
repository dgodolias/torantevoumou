using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace YourNamespace.Pages
{
    [Authorize]
    public class AdminModel : PageModel
    {
        public void OnGet()
        {
        }
        
    }
}