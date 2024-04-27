using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json;

namespace Namespace
{
    public class FirebaseService
    {
        private readonly FirebaseClient _client;

        public FirebaseService()
        {
            var privateKey = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY");
            var privateKeyId = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY_ID");
            var clientEmail = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_EMAIL");
            var clientId = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_ID");
            var authUri = Environment.GetEnvironmentVariable("FIREBASE_AUTH_URI");
            var tokenUri = Environment.GetEnvironmentVariable("FIREBASE_TOKEN_URI");
            var authProviderX509CertUrl = Environment.GetEnvironmentVariable("FIREBASE_AUTH_PROVIDER_X509_CERT_URL");
            var clientX509CertUrl = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_X509_CERT_URL");

            _client = new FirebaseClient("https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app", new FirebaseOptions
            {
                AuthTokenAsyncFactory = () => Task.FromResult(privateKey)
            });
        }

        public async Task AddClient(Client client)
        {
            await _client
                .Child("users")
                .PutAsync(client);
        }

        public async Task UpdateClient(KeyValuePair<string, Client> client)
        {
            var updateData = new { appointmentDate = client.Value.AppointmentDate, appointmentTime = client.Value.AppointmentTime };

            await _client
                .Child("users")
                .Child(client.Key)
                .PatchAsync(updateData);
        }

        public async Task DeleteClient(string id)
        {
            await _client
                .Child("users")
                .Child(id)
                .DeleteAsync();
        }

        public async Task<Dictionary<string, Client>> GetClients()
        {
            using (var httpClient = new HttpClient())
            {
                var firebaseUrl = "https://torantevoumou-86820-default-rtdb.europe-west1.firebasedatabase.app/users.json";
                var json = await httpClient.GetStringAsync(firebaseUrl);
                
                var clientsList = JsonConvert.DeserializeObject<List<Client>>(json);
                
                var clientsDict = new Dictionary<string, Client>();
                int idCounter = 0;
                foreach (var client in clientsList)
                {
                    if (client != null)
                    {
                        clientsDict.Add(idCounter.ToString(), client);
                        
                    }
                    idCounter++;
                }

                return clientsDict;
            }
        }

        public async Task<bool> UsernameExists(string username)
        {
            var clients = await GetClients();
            return clients.Any(client => client.Value.Username == username);
        }

        public async Task<bool> EmailExists(string email)
        {
            var clients = await GetClients();
            return clients.Any(client => client.Value.Email == email);
        }

        public async Task<bool> PhoneNumberExists(string phoneNumber)
        {
            var clients = await GetClients();
            return clients.Any(client => client.Value.PhoneNumber == phoneNumber);
        }

        public async Task AddUser(string firstName, string lastName, string username, string password, string email, string phoneNumber)
        {
            var client = new Client
            {
                FirstName = firstName,
                LastName = lastName,
                Username = username,
                Password = password,
                Email = email,
                PhoneNumber = phoneNumber
            };

            await AddClient(client);
        }


        public async Task<bool> UpdateClientAppointment(AppointmentModel appointment)
        {
            var clients = await GetClients();
        
            var client = clients.FirstOrDefault(client => client.Key == appointment.Id);
        
            if (client.Value == null)
            {
                return false;
            }
        
            client.Value.AppointmentDate += appointment.Date;
            client.Value.AppointmentTime += appointment.Time;
        
            await UpdateClient(client);
        
            // Fetch the latest data from the server
            clients = await GetClients();
        
            return true;
        }

        
    }
}