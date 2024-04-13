using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Namespace
{
    public class IndexModel : PageModel
    {
        private readonly FirebaseService _firebaseService;

        public IndexModel(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public List<Client>? Clients { get; set; }

        public async Task OnGetAsync()
        {
            Clients = await _firebaseService.GetClients();
        }
    }
}