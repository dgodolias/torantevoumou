using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
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

        public async Task<Dictionary<string, User>> GetUsers()
        {
            var response = await _client.GetAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/getUsers");
        
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
        
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Dictionary<string, User>>(json);
        }

        public async Task<User> GetUserDBinfo(string userId)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/GetUserDBinfo?userId={userId}");
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<User>(json);
        }
        public async Task<User> GetUserAUTHinfo(string userId)
        {
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/GetUserAUTHinfo?userId={userId}");
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<User>(json);
        }

        public async Task<User> GetUserGENERALinfo(string userId)
        {
            var userDbInfo = await GetUserDBinfo(userId);
            var userAuthInfo = await GetUserAUTHinfo(userId);
        
            return new User
            {
                FirstName = userDbInfo.FirstName ?? userAuthInfo.FirstName,
                LastName = userDbInfo.LastName ?? userAuthInfo.LastName,
                Username = userDbInfo.Username ?? userAuthInfo.Username,
                Password = userDbInfo.Password ?? userAuthInfo.Password,
                Email = userDbInfo.Email ?? userAuthInfo.Email,
                PhoneNumber = userDbInfo.PhoneNumber ?? userAuthInfo.PhoneNumber,
                serviceswithappointmentkey = userDbInfo.serviceswithappointmentkey ?? userAuthInfo.serviceswithappointmentkey
            };
        }

        public async Task<string> AddUser(User user)
        {
            Console.WriteLine($"Adding user: {JsonConvert.SerializeObject(user)}");
            var content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/addUser", content);
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return json;
        }

        public async Task<bool> UsernameExists(string username)
        {
            Console.WriteLine($"Checking if username {username} exists");
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/usernameExists?username={username}");
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<bool> EmailExists(string email)
        {
            Console.WriteLine($"Email: {email}");
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/emailExists?email={email}");
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<bool> PhoneNumberExists(string phoneNumber)
        {
            // URL encode the phone number
            string encodedPhoneNumber = System.Net.WebUtility.UrlEncode(phoneNumber);
        
            Console.WriteLine($"PhoneNumber: {encodedPhoneNumber}");
            var response = await _client.GetAsync($"https://us-central1-torantevoumou-86820.cloudfunctions.net/phoneNumberExists?phoneNumber={encodedPhoneNumber}");
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<bool>(json);
        }

        public async Task<List<AppointmentModel>> GetUserAppointments(Dictionary<string, List<string>> serviceAppointments)
        {
            List<AppointmentModel> appointments = new List<AppointmentModel>();
            Console.WriteLine($"Getting user appointments");
            Console.WriteLine($"Service appointments: {JsonConvert.SerializeObject(serviceAppointments)}");
        
            var content = new StringContent(JsonConvert.SerializeObject(serviceAppointments), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/getUserAppointments", content);
        
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
        
            var json = await response.Content.ReadAsStringAsync();
            var appointmentsResponse = JsonConvert.DeserializeObject<List<AppointmentModel>>(json);
            appointments.AddRange(appointmentsResponse);
        
            return appointments;
        }
        public async Task<List<string>> GetServices()
        {
            var response = await _client.GetAsync("https://us-central1-torantevoumou-86820.cloudfunctions.net/getServices");
        
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Server returned error code: {response.StatusCode}");
            }
        
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<string>>(json);
        }
    }
}