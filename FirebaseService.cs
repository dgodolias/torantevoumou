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
                
                var UsersDict = JsonConvert.DeserializeObject<Dictionary<string, User>>(json);

                return UsersDict;
            }
        }
        public async Task<List<User>> GetServiceAppointments(string serviceName)
        {
            using (var httpUser = new HttpClient())
            {
                var firebaseUrl = $"https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/services/{serviceName}.json";
                var json = await httpUser.GetStringAsync(firebaseUrl);
                Console.WriteLine(json);
                var ServiceList = JsonConvert.DeserializeObject<List<User>>(json);
                Console.WriteLine(ServiceList);
                return ServiceList;
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
                PhoneNumber = phoneNumber,
                serviceswithappointmentkey = ""
            };

            await _User
                .Child("users")
                .PostAsync(User);
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

        public async Task<AppointmentModel> GetAppointment(string serviceName, string appointmentKey)
        {
            using (var httpClient = new HttpClient())
            {
                var firebaseUrl = $"https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/services/{serviceName}/{appointmentKey}.json";
                var json = await httpClient.GetStringAsync(firebaseUrl);
                var appointmentData = JsonConvert.DeserializeObject<AppointmentModel>(json);
                return appointmentData;
            }
        }

        public async Task<List<string>> GetServiceNames()
        {
            using (var httpClient = new HttpClient())
            {
                var firebaseUrl = "https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/services.json";
                var json = await httpClient.GetStringAsync(firebaseUrl);
                
                // Assuming that the services are stored as key-value pairs where the key is the service name
                var servicesDict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
        
                // Extract the keys (service names) and convert them to a list
                var serviceNames = servicesDict.Keys.ToList();
        
                return serviceNames;
            }
        }
    }
}