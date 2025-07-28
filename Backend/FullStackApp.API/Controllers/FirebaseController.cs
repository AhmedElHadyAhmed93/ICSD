using FullStackApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FullStackApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FirebaseController : ControllerBase
{
    private readonly FirebaseService _firebaseService;
    private readonly ILogger<FirebaseController> _logger;

    public FirebaseController(FirebaseService firebaseService, ILogger<FirebaseController> logger)
    {
        _firebaseService = firebaseService;
        _logger = logger;
    }

    /// <summary>
    /// Send notification to a specific device token
    /// </summary>
    /// <param name="request">Notification request</param>
    /// <returns>Firebase message ID</returns>
    [HttpPost("send-notification")]
    public async Task<ActionResult> SendNotification([FromBody] SendNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var messageId = await _firebaseService.SendNotificationAsync(
                request.Token,
                request.Title,
                request.Body,
                request.Data
            );

            _logger.LogInformation($"Notification sent successfully. Message ID: {messageId}");
            return Ok(new { MessageId = messageId, Success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Firebase notification");
            return StatusCode(500, new { message = "Failed to send notification", error = ex.Message });
        }
    }

    /// <summary>
    /// Send notification to multiple device tokens
    /// </summary>
    /// <param name="request">Multicast notification request</param>
    /// <returns>Batch response with success and failure counts</returns>
    [HttpPost("send-multicast-notification")]
    public async Task<ActionResult> SendMulticastNotification([FromBody] SendMulticastNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _firebaseService.SendMulticastNotificationAsync(
                request.Tokens,
                request.Title,
                request.Body,
                request.Data
            );

            _logger.LogInformation($"Multicast notification sent. Success: {response.SuccessCount}, Failure: {response.FailureCount}");
            
            return Ok(new 
            { 
                SuccessCount = response.SuccessCount,
                FailureCount = response.FailureCount,
                TotalCount = request.Tokens.Count(),
                Success = response.SuccessCount > 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending multicast Firebase notification");
            return StatusCode(500, new { message = "Failed to send multicast notification", error = ex.Message });
        }
    }

    /// <summary>
    /// Send notification to a topic
    /// </summary>
    /// <param name="request">Topic notification request</param>
    /// <returns>Firebase message ID</returns>
    [HttpPost("send-topic-notification")]
    public async Task<ActionResult> SendTopicNotification([FromBody] SendTopicNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var messageId = await _firebaseService.SendTopicNotificationAsync(
                request.Topic,
                request.Title,
                request.Body,
                request.Data
            );

            _logger.LogInformation($"Topic notification sent successfully. Message ID: {messageId}");
            return Ok(new { MessageId = messageId, Success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Firebase topic notification");
            return StatusCode(500, new { message = "Failed to send topic notification", error = ex.Message });
        }
    }

    /// <summary>
    /// Subscribe tokens to a topic
    /// </summary>
    /// <param name="request">Topic subscription request</param>
    /// <returns>Subscription result</returns>
    [HttpPost("subscribe-to-topic")]
    public async Task<ActionResult> SubscribeToTopic([FromBody] TopicSubscriptionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _firebaseService.SubscribeToTopicAsync(request.Tokens, request.Topic);

            _logger.LogInformation($"Topic subscription completed. Success: {response.SuccessCount}, Failure: {response.FailureCount}");
            
            return Ok(new 
            { 
                SuccessCount = response.SuccessCount,
                FailureCount = response.FailureCount,
                Topic = request.Topic,
                Success = response.SuccessCount > 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error subscribing to topic {request.Topic}");
            return StatusCode(500, new { message = "Failed to subscribe to topic", error = ex.Message });
        }
    }

    /// <summary>
    /// Unsubscribe tokens from a topic
    /// </summary>
    /// <param name="request">Topic unsubscription request</param>
    /// <returns>Unsubscription result</returns>
    [HttpPost("unsubscribe-from-topic")]
    public async Task<ActionResult> UnsubscribeFromTopic([FromBody] TopicSubscriptionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _firebaseService.UnsubscribeFromTopicAsync(request.Tokens, request.Topic);

            _logger.LogInformation($"Topic unsubscription completed. Success: {response.SuccessCount}, Failure: {response.FailureCount}");
            
            return Ok(new 
            { 
                SuccessCount = response.SuccessCount,
                FailureCount = response.FailureCount,
                Topic = request.Topic,
                Success = response.SuccessCount > 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error unsubscribing from topic {request.Topic}");
            return StatusCode(500, new { message = "Failed to unsubscribe from topic", error = ex.Message });
        }
    }

    /// <summary>
    /// Send data-only notification (silent push)
    /// </summary>
    /// <param name="request">Data-only notification request</param>
    /// <returns>Firebase message ID</returns>
    [HttpPost("send-data-notification")]
    public async Task<ActionResult> SendDataNotification([FromBody] SendDataNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var messageId = await _firebaseService.SendDataOnlyNotificationAsync(request.Token, request.Data);

            _logger.LogInformation($"Data notification sent successfully. Message ID: {messageId}");
            return Ok(new { MessageId = messageId, Success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Firebase data notification");
            return StatusCode(500, new { message = "Failed to send data notification", error = ex.Message });
        }
    }
}

// Request DTOs
public class SendNotificationRequest
{
    public string Token { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
}

public class SendMulticastNotificationRequest
{
    public IEnumerable<string> Tokens { get; set; } = new List<string>();
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
}

public class SendTopicNotificationRequest
{
    public string Topic { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
}

public class TopicSubscriptionRequest
{
    public IEnumerable<string> Tokens { get; set; } = new List<string>();
    public string Topic { get; set; } = string.Empty;
}

public class SendDataNotificationRequest
{
    public string Token { get; set; } = string.Empty;
    public Dictionary<string, string> Data { get; set; } = new();
}