using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Dapper;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;

namespace Namespace
{
    [AllowAnonymous]
    public class SignupModel : PageModel
    {
        private readonly FirebaseService _firebaseService;

        [BindProperty, Required(ErrorMessage = "First name is required.")]
        public string? FirstName { get; set; }
        [BindProperty, Required(ErrorMessage = "Last name is required.")]
        public string? LastName { get; set; }
        [BindProperty, Required(ErrorMessage = "Username is required.")]
        public string? Username { get; set; }
        [BindProperty, Required(ErrorMessage = "Password is required.")]
        public string? Password { get; set; }
        [BindProperty, Required(ErrorMessage = "Email is required.")]
        public string? Email { get; set; }
        [BindProperty, Required(ErrorMessage = "Phone number is required.")]
        public string? PhoneNumber { get; set; }

        public SignupModel(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        
    }
}