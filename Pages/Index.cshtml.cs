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

        public List<User>? Users { get; set; }

        public async Task OnGetAsync()
        {
            var usersData = await _firebaseService.GetUsers();
        
            // Extract only the Client objects to the Clients list
            Users = usersData.Values.ToList();
        }
    }
}