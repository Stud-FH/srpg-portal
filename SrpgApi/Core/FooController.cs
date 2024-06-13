using Microsoft.AspNetCore.Mvc;

namespace SrpgApi.Core.WebApi;

[ApiController]
[Route("")]
public class FooController : Controller
{
    [HttpGet]
    public Task<string> Ping()
    {
        return Task.FromResult("Hello, World!");
    }
}