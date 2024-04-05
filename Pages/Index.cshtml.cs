using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace YourNamespace
{
    public class IndexModel : PageModel
    {
        private readonly MyDbContext _db;

        public IndexModel(MyDbContext db)
        {
            _db = db;
        }

        public List<Movie> Movies { get; set; }

        public async Task OnGetAsync()
        {
            Movies = await _db.Movies.ToListAsync();
        }
    }
}