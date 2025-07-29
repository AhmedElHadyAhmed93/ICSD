using FullStackApp.Core.Interfaces;
using FullStackApp.Infrastructure.Data;
using FullStackApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace FullStackApp.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add Entity Framework
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Add Redis
        services.AddSingleton<IConnectionMultiplexer>(provider =>
        {
            var connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";
            return ConnectionMultiplexer.Connect(connectionString);
        });

        // Register repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        // Auto-register services using lifecycle marker interfaces
        services.RegisterServicesByLifetime();

        return services;
    }

    private static IServiceCollection RegisterServicesByLifetime(this IServiceCollection services)
    {
        // Register Scoped services
        services.Scan(scan => scan
            .FromAssemblyOf<IScopedService>()
            .AddClasses(classes => classes.AssignableTo<IScopedService>())
            .AsSelfWithInterfaces()
            .WithScopedLifetime());

        // Register Singleton services
        services.Scan(scan => scan
            .FromAssemblyOf<ISingletonService>()
            .AddClasses(classes => classes.AssignableTo<ISingletonService>())
            .AsSelfWithInterfaces()
            .WithSingletonLifetime());

        // Register Transient services
        services.Scan(scan => scan
            .FromAssemblyOf<ITransientService>()
            .AddClasses(classes => classes.AssignableTo<ITransientService>())
            .AsSelfWithInterfaces()
            .WithTransientLifetime());

        return services;
    }
}