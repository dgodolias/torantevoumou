using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Namespace
{
    public class FirebaseService
    {
        private readonly HttpClient _client;

        public FirebaseService()
        {
            _client = new HttpClient();
        }

        public async Task UpdateUser(KeyValuePair<string, User> user)
        {
            var content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/updateUser", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteUser(string id)
        {
            var content = new StringContent(JsonConvert.SerializeObject(id), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/deleteUser", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task<Dictionary<string, User>> GetUsers()
        {
            var response = await _client.GetAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/getUsers");
        
            if (!response.IsSuccessStatusCode)
            {
                // Handle error here
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
        
            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine(json);
            return JsonConvert.DeserializeObject<Dictionary<string, User>>(json);
        }
        public async Task<List<User>> GetServiceAppointments(string serviceName)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/getServiceAppointments?serviceName={serviceName}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<User>>(json);
        }

        public async Task<bool> UsernameExists(string username)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/usernameExists?username={username}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<bool> EmailExists(string email)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/emailExists?email={email}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<bool> PhoneNumberExists(string phoneNumber)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/phoneNumberExists?phoneNumber={phoneNumber}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task AddUser(string firstName, string lastName, string username, string password, string email, string phoneNumber)
        {
            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Username = username,
                Password = password,
                Email = email,
                PhoneNumber = phoneNumber,
                serviceswithappointmentkey = ""
            };
            var content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/addUser", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task<bool> UpdateUser(string userId, Dictionary<string, object> changes)
        {
            var data = new { userId, changes };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/updateUser", content);
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<AppointmentModel> GetAppointment(string serviceName, string appointmentKey)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/getAppointment?serviceName={serviceName}&appointmentKey={appointmentKey}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AppointmentModel>(json);
        }

        public async Task<List<string>> GetServiceNames()
        {
            var response = await _client.GetAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/getServiceNames");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<string>>(json);
        }
    }
}