using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using YourNamespace;

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


app.MapGet("/", async (HttpContext context) =>
{
    try
    {
        var db = context.RequestServices.GetRequiredService<MyDbContext>();
        var movies = await db.Movies.FromSqlRaw("SELECT * FROM movie").ToListAsync();
        return Results.Ok(new OkObjectResult(movies));
    }
    catch (Exception ex)
    {
        return Results.Ok($"Database connection failed: {ex.Message}");
    }
});

app.MapRazorPages();

app.Run();
//sxolio