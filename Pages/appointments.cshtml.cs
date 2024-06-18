using Google.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace Namespace
{
    public class appointments : PageModel
    {

        
        public appointments()
        {

        }

        public List<string> ServiceNames { get; set; }

        
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            ServiceNames = HttpContext.Session.GetString("ServiceNames") != null
                ? JsonConvert.DeserializeObject<List<string>>(HttpContext.Session.GetString("ServiceNames"))
                : new List<string>();
            
            return Page();
        }

        
    }
}