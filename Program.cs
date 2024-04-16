using System.Diagnostics;

Console.WriteLine("check1");
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages(options =>
{
    options.RootDirectory = "/Pages";
});
builder.Services.AddSingleton<Namespace.FirebaseService>();
// Add session state services.
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
Console.WriteLine("check3");
app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Use session state.
app.UseSession();
Console.WriteLine("check4");
app.UseEndpoints(endpoints =>
{
    endpoints.MapRazorPages();
    endpoints.MapControllers();
});
Console.WriteLine("check5");
// Check Firebase connection
CheckFirebaseConnection().Wait();
Console.WriteLine("check6");
app.Run();

async Task CheckFirebaseConnection()
{
    var startInfo = new ProcessStartInfo
    {
        FileName = "node",
        RedirectStandardInput = true,
        RedirectStandardOutput = true,
        RedirectStandardError = true, // Redirect standard error
        UseShellExecute = false,
        CreateNoWindow = true,
        Arguments = "./firebaseprov.js"
    };

    var process = new Process { StartInfo = startInfo };
    process.Start();

    // Write a command to the Node.js process's standard input
    process.StandardInput.WriteLine("checkConnection");

    // Read the result from the Node.js process's standard output
    string output = await process.StandardOutput.ReadToEndAsync();

    // Read the error message from the Node.js process's standard error
    string error = await process.StandardError.ReadToEndAsync();
    process.WaitForExit();
    if (string.IsNullOrEmpty(error))
    {
        Console.WriteLine("Successfully connected to Firebase: " + output);
    }
    else
    {
        Console.WriteLine("Failed to connect to Firebase: " + error);
    }
}