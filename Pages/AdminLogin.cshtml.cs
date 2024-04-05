using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[AllowAnonymous]
[IgnoreAntiforgeryToken]
public class AdminLoginModel : PageModel
{
    [BindProperty]
    public string? Username { get; set; }

    [BindProperty]
    public string? Password { get; set; }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Replace "expectedUsername" and "expectedPassword" with the actual username and password.
        const string expectedUsername = "admin";
        const string expectedPassword = "123";

        if (Username == expectedUsername && Password == expectedPassword)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, Username),
                // Add other claims as needed.
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties();

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            return RedirectToPage("/Admin");
        }

        // If the user's credentials are not valid, redisplay the login page.
        return Page();
    }
}