using System.Text;
using Newtonsoft.Json;


namespace Namespace
{
    public class FirebaseService
    {
        private readonly HttpClient _client;

        public FirebaseService()
        {
            _client = new HttpClient();
        }

        public async Task UpdateUser(string userId, Dictionary<string, object> changes)
        {
            var data = new { userId, changes };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/updateUser", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteUser(string id)
        {
            var content = new StringContent(JsonConvert.SerializeObject(new { id }), Encoding.UTF8, "application/json");
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
            return JsonConvert.DeserializeObject<Dictionary<string, User>>(json);
        }

        public async Task<User> GetUserInfo(string userId)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/getUserInfo?userId={userId}");
            
            if (!response.IsSuccessStatusCode)
            {
                // Handle error here
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<User>(json);
        }

        public async Task<List<User>> GetServiceAppointments(string serviceName)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/getServiceAppointments?serviceName={serviceName}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<User>>(json);
        }

        public async Task AddUser(User user)
        {
            var content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/addUser", content);
            response.EnsureSuccessStatusCode();
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