namespace FullStackApp.Core.Interfaces;

/// <summary>
/// Marker interface for services that should be registered with Scoped lifetime
/// </summary>
public interface IScopedService
{
}

/// <summary>
/// Marker interface for services that should be registered with Singleton lifetime
/// </summary>
public interface ISingletonService
{
}

/// <summary>
/// Marker interface for services that should be registered with Transient lifetime
/// </summary>
public interface ITransientService
{
}