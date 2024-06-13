using SrpgApi.Core.Middleware;

namespace SrpgApi.Config;

public record SrpgApiConfig
{

}

[Injectable(Scope.Singleton)]
public record DiscordClientConfig
{
    public required string ClientId { get; init; }
    public required string ClientSecret { get; init;}
}

public record MariadbClientConfig
{
    public required string Version { get; init; }
    public required string ConnectionString { get; init; }
}