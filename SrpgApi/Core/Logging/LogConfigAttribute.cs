using NLog;

namespace SrpgApi.Core.Utility;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class LogConfigAttribute : Attribute
{
    public readonly LogLevel LogLevel;
    public LogConfigAttribute(Severity? severity = null)
    {
        this.LogLevel = severity switch
        {
            null => LogLevel.Warn,
            Severity.Trace => LogLevel.Trace,
            Severity.Debug => LogLevel.Debug,
            Severity.Info => LogLevel.Info,
            Severity.Warn => LogLevel.Warn,
            Severity.Error => LogLevel.Error,
            Severity.Fatal => LogLevel.Fatal,
            Severity.Off => LogLevel.Off,
            _ => throw new ArgumentException($"unhandled case: {severity}"),
        };
    }
}

public enum Severity
{
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Fatal,
    Off,
}