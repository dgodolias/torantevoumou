using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class ForgotPassword : PageModel
    {
        private readonly FirebaseService _firebaseService;
        public List<string> ServiceNames { get; set; }

        public ForgotPassword(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

    }
}