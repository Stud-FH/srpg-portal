using System.Text.Json;
using AspNet.Security.OAuth.Discord;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SrpgApi.Config;


static T Read<T>(string path) where T : class
{
    using (var reader = new StreamReader(path))
    {
        var json = reader.ReadToEnd();
        var jsonSerializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<T>(json, jsonSerializerOptions) ?? throw new Exception($"could not interpret {path}");
    }
}

var discordClientConfig = Read<DiscordClientConfig>("discord-client.json");
var mariadbClientConfig = Read<MariadbClientConfig>("mariadb-client.json");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = DiscordAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddDiscord(options =>
    {
        options.ClientId = discordClientConfig.ClientId;
        options.ClientSecret = discordClientConfig.ClientSecret;
        options.Scope.Add("identify");
    });

builder.Services.AddDbContext<SrpgApi.Db.DbContext>(options =>
    options.UseMySql(mariadbClientConfig.ConnectionString,
    new MySqlServerVersion(mariadbClientConfig.Version)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

