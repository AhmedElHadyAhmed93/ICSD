using FullStackApp.Core.DTOs;
using FullStackApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FullStackApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MongoDocumentsController : ControllerBase
{
    private readonly MongoDocumentService _mongoDocumentService;
    private readonly ILogger<MongoDocumentsController> _logger;

    public MongoDocumentsController(
        MongoDocumentService mongoDocumentService,
        ILogger<MongoDocumentsController> logger)
    {
        _mongoDocumentService = mongoDocumentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all MongoDB documents
    /// </summary>
    /// <returns>List of documents</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MongoDocumentDto>>> GetDocuments()
    {
        try
        {
            var documents = await _mongoDocumentService.GetAllAsync();
            _logger.LogInformation($"Retrieved {documents.Count()} documents");
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving MongoDB documents");
            return StatusCode(500, new { message = "An error occurred while retrieving documents" });
        }
    }

    /// <summary>
    /// Get document by ID
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Document details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<MongoDocumentDto>> GetDocument(string id)
    {
        try
        {
            var document = await _mongoDocumentService.GetByIdAsync(id);
            if (document == null)
            {
                return NotFound(new { message = $"Document with ID {id} not found" });
            }

            return Ok(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving document with ID {id}");
            return StatusCode(500, new { message = "An error occurred while retrieving the document" });
        }
    }

    /// <summary>
    /// Get documents by creator
    /// </summary>
    /// <param name="createdBy">Creator user ID</param>
    /// <returns>List of documents created by the user</returns>
    [HttpGet("by-creator/{createdBy}")]
    public async Task<ActionResult<IEnumerable<MongoDocumentDto>>> GetDocumentsByCreator(string createdBy)
    {
        try
        {
            var documents = await _mongoDocumentService.GetByCreatedByAsync(createdBy);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving documents by creator {createdBy}");
            return StatusCode(500, new { message = "An error occurred while retrieving documents" });
        }
    }

    /// <summary>
    /// Search documents by text
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <returns>List of matching documents</returns>
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<MongoDocumentDto>>> SearchDocuments([FromQuery] string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new { message = "Search term is required" });
            }

            var documents = await _mongoDocumentService.SearchAsync(searchTerm);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error searching documents with term: {searchTerm}");
            return StatusCode(500, new { message = "An error occurred while searching documents" });
        }
    }

    /// <summary>
    /// Get documents by tags
    /// </summary>
    /// <param name="tags">Comma-separated list of tags</param>
    /// <returns>List of documents with matching tags</returns>
    [HttpGet("by-tags")]
    public async Task<ActionResult<IEnumerable<MongoDocumentDto>>> GetDocumentsByTags([FromQuery] string tags)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(tags))
            {
                return BadRequest(new { message = "Tags parameter is required" });
            }

            var tagList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                             .Select(tag => tag.Trim())
                             .ToList();

            var documents = await _mongoDocumentService.GetByTagsAsync(tagList);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving documents by tags: {tags}");
            return StatusCode(500, new { message = "An error occurred while retrieving documents" });
        }
    }

    /// <summary>
    /// Create a new document
    /// </summary>
    /// <param name="createDocumentDto">Document creation details</param>
    /// <returns>Created document</returns>
    [HttpPost]
    public async Task<ActionResult<MongoDocumentDto>> CreateDocument([FromBody] CreateMongoDocumentDto createDocumentDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var document = await _mongoDocumentService.CreateAsync(createDocumentDto, userId);
            
            _logger.LogInformation($"MongoDB document created successfully: {document.Title}");
            return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating MongoDB document");
            return StatusCode(500, new { message = "An error occurred while creating the document" });
        }
    }

    /// <summary>
    /// Update an existing document
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <param name="updateDocumentDto">Document update details</param>
    /// <returns>Updated document</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<MongoDocumentDto>> UpdateDocument(string id, [FromBody] UpdateMongoDocumentDto updateDocumentDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var document = await _mongoDocumentService.UpdateAsync(id, updateDocumentDto);
            if (document == null)
            {
                return NotFound(new { message = $"Document with ID {id} not found" });
            }

            _logger.LogInformation($"MongoDB document updated successfully: {document.Title}");
            return Ok(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating MongoDB document with ID {id}");
            return StatusCode(500, new { message = "An error occurred while updating the document" });
        }
    }

    /// <summary>
    /// Delete a document
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Success confirmation</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDocument(string id)
    {
        try
        {
            var result = await _mongoDocumentService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Document with ID {id} not found" });
            }

            _logger.LogInformation($"MongoDB document deleted successfully: ID {id}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting MongoDB document with ID {id}");
            return StatusCode(500, new { message = "An error occurred while deleting the document" });
        }
    }

    /// <summary>
    /// Get documents count
    /// </summary>
    /// <returns>Total documents count</returns>
    [HttpGet("count")]
    public async Task<ActionResult<long>> GetDocumentsCount()
    {
        try
        {
            var count = await _mongoDocumentService.CountAsync();
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving MongoDB documents count");
            return StatusCode(500, new { message = "An error occurred while retrieving documents count" });
        }
    }

    /// <summary>
    /// Get documents count by creator
    /// </summary>
    /// <param name="createdBy">Creator user ID</param>
    /// <returns>Documents count for the creator</returns>
    [HttpGet("count/by-creator/{createdBy}")]
    public async Task<ActionResult<long>> GetDocumentsCountByCreator(string createdBy)
    {
        try
        {
            var count = await _mongoDocumentService.CountByCreatedByAsync(createdBy);
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving documents count by creator {createdBy}");
            return StatusCode(500, new { message = "An error occurred while retrieving documents count" });
        }
    }

    /// <summary>
    /// Get tag statistics
    /// </summary>
    /// <returns>Tag usage statistics</returns>
    [HttpGet("tag-statistics")]
    public async Task<ActionResult<IEnumerable<object>>> GetTagStatistics()
    {
        try
        {
            var statistics = await _mongoDocumentService.GetTagStatisticsAsync();
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tag statistics");
            return StatusCode(500, new { message = "An error occurred while retrieving tag statistics" });
        }
    }
}