using Microsoft.AspNetCore.Mvc;
using SrpgApi.Auth.Domain;

namespace SrpgApi.Core.WebApi;

[ApiController]
[Route($"api/v1/[controller]")]
public class AuthController : Controller
{
    public required AuthenticationService authenticationService { get; init; }

    [HttpPost]
    public async Task<string> GenerateDiscordLoginUrl([FromQuery] string redirectUri)
    {
        return await this.authenticationService.GenerateDiscordLoginUrl(redirectUri);
    }
}