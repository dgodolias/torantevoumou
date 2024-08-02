using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class ChangePassword : PageModel
    {
        private readonly FirebaseService _firebaseService;
        public List<string> ServiceNames { get; set; }

        public ChangePassword(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

    }
}