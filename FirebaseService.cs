using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json;

namespace Namespace
{
    public class FirebaseService
    {
        private readonly FirebaseClient _User;

        public FirebaseService()
        {
            var privateKey = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY");
            var privateKeyId = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY_ID");
            var UserEmail = Environment.GetEnvironmentVariable("FIREBASE_User_EMAIL");
            var UserId = Environment.GetEnvironmentVariable("FIREBASE_User_ID");
            var authUri = Environment.GetEnvironmentVariable("FIREBASE_AUTH_URI");
            var tokenUri = Environment.GetEnvironmentVariable("FIREBASE_TOKEN_URI");
            var authProviderX509CertUrl = Environment.GetEnvironmentVariable("FIREBASE_AUTH_PROVIDER_X509_CERT_URL");
            var UserX509CertUrl = Environment.GetEnvironmentVariable("FIREBASE_User_X509_CERT_URL");

            _User = new FirebaseClient("https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app", new FirebaseOptions
            {
                AuthTokenAsyncFactory = () => Task.FromResult(privateKey)
            });
        }

        public async Task AddUser(User User)
        {
            await _User
                .Child("users")
                .PutAsync(User);
        }

        public async Task UpdateUser(KeyValuePair<string, User> User)
        {
            await _User
                .Child("users")
                .Child(User.Key)
                .PutAsync(User.Value);
        }

        public async Task DeleteUser(string id)
        {
            await _User
                .Child("users")
                .Child(id)
                .DeleteAsync();
        }

        public async Task<Dictionary<string, User>> GetUsers()
        {
            using (var httpUser = new HttpClient())
            {
                var firebaseUrl = "https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/users.json";
                var json = await httpUser.GetStringAsync(firebaseUrl);
                
                var UsersList = JsonConvert.DeserializeObject<List<User>>(json);
                
                var UsersDict = new Dictionary<string, User>();
                int idCounter = 0;
                foreach (var User in UsersList)
                {
                    if (User != null)
                    {
                        UsersDict.Add(idCounter.ToString(), User);
                        
                    }
                    idCounter++;
                }

                return UsersDict;
            }
        }

        public async Task<bool> UsernameExists(string username)
        {
            var Users = await GetUsers();
            return Users.Any(User => User.Value.Username == username);
        }

        public async Task<bool> EmailExists(string email)
        {
            var Users = await GetUsers();
            return Users.Any(User => User.Value.Email == email);
        }

        public async Task<bool> PhoneNumberExists(string phoneNumber)
        {
            var Users = await GetUsers();
            return Users.Any(User => User.Value.PhoneNumber == phoneNumber);
        }

        public async Task AddUser(string firstName, string lastName, string username, string password, string email, string phoneNumber)
        {
            var User = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Username = username,
                Password = password,
                Email = email,
                PhoneNumber = phoneNumber
            };

            await AddUser(User);
        }

        public async Task<bool> UpdateUser(string userId, Dictionary<string, object> changes)
        {
            Console.WriteLine($"Updating user {userId}...");
        
            var Users = await GetUsers();
        
            var User = Users.FirstOrDefault(User => User.Key == userId);
        
            if (User.Value == null)
            {
                Console.WriteLine($"User {userId} not found.");
                return false;
            }
        
            Console.WriteLine($"User {userId} found. Applying changes...");
        
            var change = changes.First();
            List<string> UserFieldNames = typeof(User).GetProperties().Select(property => property.Name).ToList();
            Console.WriteLine($"UserFieldNames: {string.Join(", ", UserFieldNames)}");
            for (int i = 0; i < UserFieldNames.Count; i++)
            {
                if (string.Equals(change.Key, UserFieldNames[i], StringComparison.OrdinalIgnoreCase))
                {
                    switch (change.Key.ToLower())
                    {
                        case "email":
                            User.Value.Email = change.Value.ToString();
                            break;
                        case "firstname":
                            User.Value.FirstName = change.Value.ToString();
                            break;
                        case "lastname":
                            User.Value.LastName = change.Value.ToString();
                            break;
                        case "password":
                            User.Value.Password = change.Value.ToString();
                            break;
                        case "phonenumber":
                            User.Value.PhoneNumber = change.Value.ToString();
                            break;
                        case "username":
                            User.Value.Username = change.Value.ToString();
                            break;
                        default:
                            Console.WriteLine($"No action defined for field {change.Key}.");
                            break;
                    }
                    Console.WriteLine($"Set {change.Key} to {change.Value}.");
                    break;
                }
            }

        
            await _User
                .Child("users")
                .Child(User.Key)
                .PutAsync(User.Value);
        
            // Fetch the latest data from the server
            Users = await GetUsers();
        
            Console.WriteLine($"User {userId} updated successfully.");
        
            return true;
        }
    }
}