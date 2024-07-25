using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class Heatmap : PageModel
    {
        private readonly FirebaseService _firebaseService;
        public List<string> ServiceNames { get; set; }

        public Heatmap(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

    }
}