using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Namespace
{
    public class IndexModel : PageModel
    {
        private readonly MyDbContext _db;

        public IndexModel(MyDbContext db)
        {
            _db = db;
        }

        public List<Client>? Clients { get; set; }

        public async Task OnGetAsync()
        {
            Clients = await _db.Clients.ToListAsync();
        }
    }
}