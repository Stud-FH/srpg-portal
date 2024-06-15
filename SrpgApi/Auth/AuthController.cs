using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NLog;

namespace SrpgApi.Auth;

[ApiController]
[Route($"api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private static Dictionary<string, string> nonceRegistry = new();
    private Logger Logger = LogManager.GetCurrentClassLogger();

    private readonly IHttpClientFactory httpClientFactory;
    private readonly IConfiguration configuration;

    public AuthController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        this.httpClientFactory = httpClientFactory;
        this.configuration = configuration;
    }

    public record NonceRecord(string Nonce, string CodeVerifier);

    [HttpPost("nonce")]
    public async Task PostNonceRecord(NonceRecord data)
    {
        nonceRegistry[data.Nonce] = data.CodeVerifier;
        await Log($"nonce: {data.Nonce}\ncodeVerifier: {data.CodeVerifier}");
    }

    [HttpGet("callback")]
    public async Task<UserInfo> Callback(string code, string state)
    {
        using var client = httpClientFactory.CreateClient();
        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://discord.com/api/oauth2/token")
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = this.configuration["Discord:ClientId"]!,
                ["client_secret"] = configuration["Discord:ClientSecret"]!,
                ["redirect_uri"] = configuration["Discord:RedirectUri"]!,
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["code_verifier"] = await GetCodeVerifierAsync(state),
                ["scope"] = "identify",
            })
        };

        var response = await client.SendAsync(tokenRequest);
        await Log(response, "token exchange");
        if (!response.IsSuccessStatusCode)
        {
            // TODO differentiate unauthorized from system errors
            throw new Exception("Token exchange failed.");
        }

        var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>() ?? throw new Exception("Failed to parse Token response.");

        var request = new HttpRequestMessage(HttpMethod.Get, "https://discord.com/api/users/@me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResponse.AccessToken);

        response = await client.SendAsync(request);
        await Log(response, "user info");
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("User Info failed.");
        }

        return await response.Content.ReadFromJsonAsync<UserInfo>() ?? throw new Exception("Failed to parse User Info.");
    }

    private async Task<string> GetCodeVerifierAsync(string nonce, long timeout = 2000)
    {
        var abortTime = DateTime.Now + TimeSpan.FromMilliseconds(timeout);

        while (DateTime.Now < abortTime)
        {
            if (nonceRegistry.TryGetValue(nonce, out var codeVerifier))
            {
                // TODO clear registry periodically
                nonceRegistry.Remove(nonce);
                return codeVerifier;
            }

            await Task.Delay(100);
        }

        throw new Exception($"code verifier not registered for {nonce}");
    }

    private async Task Log(string message, string label = "")
    {
        Directory.CreateDirectory($"log");
        using (var writer = new StreamWriter($"log/{label}-{DateTime.Now:yyyy-MM-dd-HH-mm-ssss}.txt"))
        {
            await writer.WriteLineAsync(message);
        }
    }

    private async Task Log(HttpResponseMessage response, string label = "unknown")
    {
        await Log($"response {label}\nstatus: {response.StatusCode}\n{await response.Content.ReadAsStringAsync()}");
    }

    public class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public required string AccessToken { get; init; }

        [JsonPropertyName("expires_in")]
        public required int ExpiresIn { get; init; }

        [JsonPropertyName("token_type")]
        public required string TokenType { get; init; }

        [JsonPropertyName("scope")]
        public required string Scope { get; init; }
    }

    public class UserInfo
    {
        [JsonPropertyName("id")]
        public required string Id { get; init; }

        [JsonPropertyName("username")]
        public required string Username { get; init; }

        [JsonPropertyName("discriminator")]
        public required string Discriminator { get; init; }

        [JsonPropertyName("avatar")]
        public required string Avatar { get; init; }
    }
}