using Microsoft.EntityFrameworkCore;
using YourNamespace;
using System.Timers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyDbConnection")));

// Add Razor Pages services.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();


List<YourNamespace.Movie> movieList = new List<YourNamespace.Movie>();

app.MapGet("/", async (HttpContext context) =>
{
    try
    {
        var db = context.RequestServices.GetRequiredService<MyDbContext>();
        var movies = await db.Movies.FromSqlRaw("SELECT * FROM movie").ToListAsync();
        movieList = movies; // Store the movies in the list
        // Print each movie in the terminal
        /*foreach (var movie in movies)
        {
            Console.WriteLine($"Id: {movie.Id}, Title: {movie.Title}");
        }*/
        return Results.Ok("Successfully retrieved dataaa"); // Add a return statement to ensure all code paths return a value
    }
    catch (Exception ex)
    {
        return Results.Ok($"Database connection failed: {ex.Message}");
    }
});

var timer = new System.Timers.Timer(1000);
timer.Elapsed += (sender, e) =>
{
    if (movieList.Count > 0)
    {
        foreach (var movie in movieList)
        {
            Console.WriteLine($"Id: {movie.Id}, Title: {movie.Title}");
        }

        // Stop the timer after printing the movies
        timer.Stop();
    }
};
timer.Start();

app.MapRazorPages();

app.Run();