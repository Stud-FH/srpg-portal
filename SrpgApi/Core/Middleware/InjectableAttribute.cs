using System;
using System.Runtime.CompilerServices;
using Autofac;
using Autofac.Core.Resolving.Pipeline;
using Microsoft.AspNetCore.Mvc.Filters;
using NLog;

namespace SrpgApi.Core.Middleware;

[AttributeUsage(AttributeTargets.Class)]
public sealed class InjectableAttribute : Attribute
{
    public Scope TargetScope;

    public InjectableAttribute(Scope scope = Scope.InstancePerLifetime)
    {
        this.TargetScope = scope;
    }
}

public enum Scope
{
    Singleton,
    InstancePerLifetime,
    InstancePerDependency,
}

[AttributeUsage(AttributeTargets.Method)]
public sealed class OnInitAttribute : Attribute
{}

public class RequiredFieldResolvingMiddlewareSource : IResolveMiddleware
{
    private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

    public PipelinePhase Phase => PipelinePhase.Activation;

    public async void Execute(ResolveRequestContext context, Action<ResolveRequestContext> next)
    {
        next(context);
        InjectFields(context.Instance!, context.Resolve);
        await CallOnActivatedMethod(context.Instance!);
    }

    public static void InjectFields(object instance, Func<Type, object> resolve)
    {
        foreach (var info in instance.GetType().GetFields().Where(i => Attribute.IsDefined(i, typeof(RequiredMemberAttribute))))
        {
            try
            {
                info.SetValue(instance, resolve(info.FieldType));
            }
            catch (Exception)
            {
                Logger.Error($"Failed to inject {info.Name} at {info.DeclaringType}");
                throw;
            }
        }
    }

    public static async Task CallOnActivatedMethod(object instance)
    {
        foreach (var info in instance.GetType().GetMethods().Where(i => Attribute.IsDefined(i, typeof(OnInitAttribute))))
        {
            try
            {
                var returnValue = info.Invoke(instance, null);

                if (returnValue is Task task)
                {
                    await task;
                }
            }
            catch (Exception)
            {
                Logger.Error($"Failed to call init method {info.Name} at {info.DeclaringType}");
                throw;
            }
        }
    }

    public static void Register(ContainerBuilder builder)
    {
        builder.ComponentRegistryBuilder.Registered += (sender, args) =>
        {
            args.ComponentRegistration.PipelineBuilding += (sender2, pipeline) =>
            {
                pipeline.Use(new RequiredFieldResolvingMiddlewareSource());
            };
        };
    }
}
