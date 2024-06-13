using System;
using System.Runtime.CompilerServices;
using Autofac;
using Autofac.Core.Resolving.Pipeline;
using Microsoft.AspNetCore.Mvc.Filters;
using NLog;
using SrpgApi.Core.Utility;

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

[LogConfig(Severity.Debug)]
public class RequiredFieldResolvingMiddlewareSource : IResolveMiddleware
{
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
            catch (Exception e)
            {
                throw new Exception(
                    "Error while injecting field " + info + " declared in " + info.DeclaringType +
                    (info.DeclaringType != instance.GetType() ? " of instance of type " + instance.GetType() : string.Empty),
                    e);
            }
        }
    }

    public static async Task CallOnActivatedMethod(object instance)
    {
        foreach (var info in instance.GetType().GetMethods())
        {
            if (Attribute.IsDefined(info, typeof(Register.OnActivatedAttribute)))
            {
                try
                {
                    var returnValue = info.Invoke(instance, null);

                    if (returnValue is Task task)
                    {
                        await task;
                    }
                }
                catch (Exception e)
                {
                    throw new Exception(
                        "Error while invoking method " + info + " declared in " + info.DeclaringType,
                        e);
                }
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

public class RequiredFieldResolvingActionFilter : IAsyncActionFilter
{
    /// <inheritdoc/>
    public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        RequiredFieldResolvingMiddlewareSource.InjectFields(context.Controller, context.HttpContext.RequestServices.GetRequiredService);
        return next();
    }
}