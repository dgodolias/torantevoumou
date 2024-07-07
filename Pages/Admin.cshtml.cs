using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class Admin : PageModel
    {
        private readonly FirebaseService _firebaseService;

        public Admin(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }


        public async Task<IActionResult> OnGetAsync()
        {

            return Page();
        }
    }
}