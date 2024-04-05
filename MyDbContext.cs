using Microsoft.EntityFrameworkCore;

namespace YourNamespace;
public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
}

public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Movie> Movies { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Movie>().ToTable("movie");
    }
}