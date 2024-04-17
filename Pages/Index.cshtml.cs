using Microsoft.AspNetCore.Mvc.RazorPages;

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
            var clientsData = await _firebaseService.GetClients();
        
            // Extract only the Client objects to the Clients list
            Clients = clientsData.Values.ToList();
        }
    }
}