using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class DashboardModel : PageModel
    {
        public string Message { get; private set; } = "PageModel in C# for Razor Pages";

        public void OnGet()
        {
            Message += $" Server time is { DateTime.Now }";
        }
    }
}