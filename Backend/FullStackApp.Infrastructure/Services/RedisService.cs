using FullStackApp.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System.Text.Json;

namespace FullStackApp.Infrastructure.Services;

public class RedisService : ISingletonService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;
    private readonly ISubscriber _subscriber;

    public RedisService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _database = redis.GetDatabase();
        _subscriber = redis.GetSubscriber();
    }

    // Caching methods
    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _database.StringGetAsync(key);
        if (!value.HasValue)
            return default;

        return JsonSerializer.Deserialize<T>(value!);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var serializedValue = JsonSerializer.Serialize(value);
        await _database.StringSetAsync(key, serializedValue, expiry);
    }

    public async Task<bool> ExistsAsync(string key)
    {
        return await _database.KeyExistsAsync(key);
    }

    public async Task<bool> DeleteAsync(string key)
    {
        return await _database.KeyDeleteAsync(key);
    }

    public async Task<long> DeleteAsync(params string[] keys)
    {
        var redisKeys = keys.Select(k => (RedisKey)k).ToArray();
        return await _database.KeyDeleteAsync(redisKeys);
    }

    // Hash operations
    public async Task HashSetAsync<T>(string key, string field, T value)
    {
        var serializedValue = JsonSerializer.Serialize(value);
        await _database.HashSetAsync(key, field, serializedValue);
    }

    public async Task<T?> HashGetAsync<T>(string key, string field)
    {
        var value = await _database.HashGetAsync(key, field);
        if (!value.HasValue)
            return default;

        return JsonSerializer.Deserialize<T>(value!);
    }

    public async Task<bool> HashDeleteAsync(string key, string field)
    {
        return await _database.HashDeleteAsync(key, field);
    }

    // List operations
    public async Task<long> ListPushAsync<T>(string key, T value)
    {
        var serializedValue = JsonSerializer.Serialize(value);
        return await _database.ListLeftPushAsync(key, serializedValue);
    }

    public async Task<T?> ListPopAsync<T>(string key)
    {
        var value = await _database.ListLeftPopAsync(key);
        if (!value.HasValue)
            return default;

        return JsonSerializer.Deserialize<T>(value!);
    }

    // Pub/Sub operations
    public async Task PublishAsync<T>(string channel, T message)
    {
        var serializedMessage = JsonSerializer.Serialize(message);
        await _subscriber.PublishAsync(channel, serializedMessage);
    }

    public async Task SubscribeAsync<T>(string channel, Action<T> handler)
    {
        await _subscriber.SubscribeAsync(channel, (ch, message) =>
        {
            if (message.HasValue)
            {
                var deserializedMessage = JsonSerializer.Deserialize<T>(message!);
                if (deserializedMessage != null)
                {
                    handler(deserializedMessage);
                }
            }
        });
    }

    // Cache with callback pattern
    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> getItem, TimeSpan? expiry = null)
    {
        var cachedValue = await GetAsync<T>(key);
        if (cachedValue != null)
            return cachedValue;

        var item = await getItem();
        await SetAsync(key, item, expiry);
        return item;
    }

    // Pattern-based key deletion
    public async Task DeleteByPatternAsync(string pattern)
    {
        var server = _redis.GetServer(_redis.GetEndPoints().First());
        var keys = server.Keys(pattern: pattern);
        
        var keyArray = keys.Select(k => (RedisKey)k).ToArray();
        if (keyArray.Any())
        {
            await _database.KeyDeleteAsync(keyArray);
        }
    }

    // Health check
    public async Task<bool> IsConnectedAsync()
    {
        try
        {
            await _database.PingAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}