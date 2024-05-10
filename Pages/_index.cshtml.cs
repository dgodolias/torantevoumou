using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Namespace
{
    public class _Index : PageModel
    {
        private readonly FirebaseService _firebaseService;

        public _Index(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public List<Client>? Clients { get; set; }

        public async Task OnGetAsync()
        {

        }
    }
}