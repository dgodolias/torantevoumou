using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class Index : PageModel
    {
        private readonly FirebaseService _firebaseService;
        private List<string> ServiceNames { get; set; }

        public Index(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }


        public async Task OnGetAsync()
        {
            Console.WriteLine("Index OnGetAsync");
            ServiceNames = await _firebaseService.GetServices();
            Console.WriteLine($"ServiceNames:{ServiceNames} ");
            

        }
    }
}