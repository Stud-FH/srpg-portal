using SrpgApi.Config;
using SrpgApi.Core.Middleware;

namespace SrpgApi.Auth.Domain;

[Injectable]
public class AuthenticationService
{
    public required DiscordClientConfig discordClient { get; init;}

    public async Task<string> GenerateDiscordLoginUrl(string redirectUri)
    {
        return $"https://discord.com/oauth2/authorize?client_id={this.discordClient.ClientId}&response_type=code&redirect_uri={redirectUri}&scope=identify";
    }
}
