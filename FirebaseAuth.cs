using System;
using System.IO;

public class FirebaseAuth
{
    public string Type { get; set; } = "service_account";
    public string ProjectId { get; set; } = "torantevoumou";
    public string PrivateKeyId { get; set; } = "39e9eb25a56f32af7afdcfa0a02e3d324a37fe53";
    public string PrivateKey { get; set; }
    public string ClientEmail { get; set; } = "firebase-adminsdk-xzywf@torantevoumou.iam.gserviceaccount.com";
    public string ClientId { get; set; } = "118208077520675921916";
    public string AuthUri { get; set; } = "https://accounts.google.com/o/oauth2/auth";
    public string TokenUri { get; set; } = "https://oauth2.googleapis.com/token";
    public string AuthProviderX509CertUrl { get; set; } = "https://www.googleapis.com/oauth2/v1/certs";
    public string ClientX509CertUrl { get; set; } = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xzywf%40torantevoumou.iam.gserviceaccount.com";
    public string UniverseDomain { get; set; } = "googleapis.com";

    public FirebaseAuth()
    {
        string privateKey = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY");
        if (string.IsNullOrEmpty(privateKey))
        {
            PrivateKey = File.ReadAllText("./key.json");
        }
        else
        {
            PrivateKey = privateKey;
        }
    }
}