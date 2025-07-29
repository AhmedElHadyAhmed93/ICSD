using FullStackApp.Core.DTOs;
using FullStackApp.Core.Entities;
using FullStackApp.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace FullStackApp.Infrastructure.Services;

public class MongoDocumentService : IScopedService
{
    private readonly IMongoCollection<MongoDocument> _collection;

    public MongoDocumentService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "FullStackAppDB";
        var collectionName = configuration["MongoDB:CollectionName"] ?? "Documents";

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        _collection = database.GetCollection<MongoDocument>(collectionName);

        // Create indexes
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var indexKeysDefinition = Builders<MongoDocument>.IndexKeys
            .Ascending(x => x.Title)
            .Ascending(x => x.CreatedBy)
            .Ascending(x => x.CreatedAt);

        var indexModel = new CreateIndexModel<MongoDocument>(indexKeysDefinition);
        _collection.Indexes.CreateOne(indexModel);

        // Text index for search
        var textIndexKeys = Builders<MongoDocument>.IndexKeys
            .Text(x => x.Title)
            .Text(x => x.Content);

        var textIndexModel = new CreateIndexModel<MongoDocument>(textIndexKeys);
        _collection.Indexes.CreateOne(textIndexModel);
    }

    public async Task<IEnumerable<MongoDocumentDto>> GetAllAsync()
    {
        var documents = await _collection.Find(_ => true).ToListAsync();
        return documents.Select(MapToDto);
    }

    public async Task<MongoDocumentDto?> GetByIdAsync(string id)
    {
        var document = await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        return document != null ? MapToDto(document) : null;
    }

    public async Task<IEnumerable<MongoDocumentDto>> GetByCreatedByAsync(string createdBy)
    {
        var documents = await _collection.Find(x => x.CreatedBy == createdBy).ToListAsync();
        return documents.Select(MapToDto);
    }

    public async Task<IEnumerable<MongoDocumentDto>> SearchAsync(string searchTerm)
    {
        var filter = Builders<MongoDocument>.Filter.Text(searchTerm);
        var documents = await _collection.Find(filter).ToListAsync();
        return documents.Select(MapToDto);
    }

    public async Task<IEnumerable<MongoDocumentDto>> GetByTagsAsync(IEnumerable<string> tags)
    {
        var filter = Builders<MongoDocument>.Filter.AnyIn(x => x.Tags, tags);
        var documents = await _collection.Find(filter).ToListAsync();
        return documents.Select(MapToDto);
    }

    public async Task<MongoDocumentDto> CreateAsync(CreateMongoDocumentDto createDto, string createdBy)
    {
        var document = new MongoDocument
        {
            Title = createDto.Title,
            Content = createDto.Content,
            Tags = createDto.Tags,
            Metadata = createDto.Metadata,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _collection.InsertOneAsync(document);
        return MapToDto(document);
    }

    public async Task<MongoDocumentDto?> UpdateAsync(string id, UpdateMongoDocumentDto updateDto)
    {
        var update = Builders<MongoDocument>.Update
            .Set(x => x.Title, updateDto.Title)
            .Set(x => x.Content, updateDto.Content)
            .Set(x => x.Tags, updateDto.Tags)
            .Set(x => x.Metadata, updateDto.Metadata)
            .Set(x => x.UpdatedAt, DateTime.UtcNow);

        var options = new FindOneAndUpdateOptions<MongoDocument>
        {
            ReturnDocument = ReturnDocument.After
        };

        var updatedDocument = await _collection.FindOneAndUpdateAsync(
            x => x.Id == id, 
            update, 
            options);

        return updatedDocument != null ? MapToDto(updatedDocument) : null;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(x => x.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<long> CountAsync()
    {
        return await _collection.CountDocumentsAsync(_ => true);
    }

    public async Task<long> CountByCreatedByAsync(string createdBy)
    {
        return await _collection.CountDocumentsAsync(x => x.CreatedBy == createdBy);
    }

    // Aggregation example
    public async Task<IEnumerable<object>> GetTagStatisticsAsync()
    {
        var pipeline = new[]
        {
            new BsonDocument("$unwind", "$tags"),
            new BsonDocument("$group", new BsonDocument
            {
                { "_id", "$tags" },
                { "count", new BsonDocument("$sum", 1) }
            }),
            new BsonDocument("$sort", new BsonDocument("count", -1))
        };

        var result = await _collection.Aggregate<BsonDocument>(pipeline).ToListAsync();
        return result.Select(doc => new { Tag = doc["_id"].AsString, Count = doc["count"].AsInt32 });
    }

    private MongoDocumentDto MapToDto(MongoDocument document)
    {
        return new MongoDocumentDto
        {
            Id = document.Id,
            Title = document.Title,
            Content = document.Content,
            Tags = document.Tags,
            Metadata = document.Metadata,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt,
            CreatedBy = document.CreatedBy
        };
    }
}