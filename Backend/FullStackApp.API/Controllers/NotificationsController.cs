using FullStackApp.API.Hubs;
using FullStackApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FullStackApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly RedisService _redisService;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(
        IHubContext<NotificationHub> hubContext,
        RedisService redisService,
        ILogger<NotificationsController> logger)
    {
        _hubContext = hubContext;
        _redisService = redisService;
        _logger = logger;
    }

    /// <summary>
    /// Send notification to all connected clients
    /// </summary>
    /// <param name="request">Notification request</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("broadcast")]
    public async Task<ActionResult> BroadcastNotification([FromBody] BroadcastNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Title = request.Title,
                Message = request.Message,
                Type = request.Type ?? "info",
                Timestamp = DateTime.UtcNow
            });

            // Also publish to Redis for pub/sub pattern
            await _redisService.PublishAsync("notifications", new
            {
                Title = request.Title,
                Message = request.Message,
                Type = request.Type ?? "info",
                Timestamp = DateTime.UtcNow
            });

            _logger.LogInformation($"Broadcast notification sent: {request.Title}");
            return Ok(new { message = "Notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting notification");
            return StatusCode(500, new { message = "Failed to send notification" });
        }
    }

    /// <summary>
    /// Send notification to a specific user
    /// </summary>
    /// <param name="request">User notification request</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("send-to-user")]
    public async Task<ActionResult> SendNotificationToUser([FromBody] UserNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Send to user's personal group
            await _hubContext.Clients.Group($"user_{request.UserId}").SendAsync("ReceiveNotification", new
            {
                Title = request.Title,
                Message = request.Message,
                Type = request.Type ?? "info",
                Timestamp = DateTime.UtcNow,
                IsPersonal = true
            });

            _logger.LogInformation($"Notification sent to user {request.UserId}: {request.Title}");
            return Ok(new { message = "Notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to user {request.UserId}");
            return StatusCode(500, new { message = "Failed to send notification" });
        }
    }

    /// <summary>
    /// Send notification to users with specific role
    /// </summary>
    /// <param name="request">Role notification request</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("send-to-role")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> SendNotificationToRole([FromBody] RoleNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _hubContext.Clients.Group($"role_{request.Role}").SendAsync("RoleNotification", new
            {
                Title = request.Title,
                Message = request.Message,
                Role = request.Role,
                Type = request.Type ?? "info",
                Timestamp = DateTime.UtcNow
            });

            _logger.LogInformation($"Notification sent to role {request.Role}: {request.Title}");
            return Ok(new { message = "Notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to role {request.Role}");
            return StatusCode(500, new { message = "Failed to send notification" });
        }
    }

    /// <summary>
    /// Send notification to a specific group
    /// </summary>
    /// <param name="request">Group notification request</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("send-to-group")]
    public async Task<ActionResult> SendNotificationToGroup([FromBody] GroupNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _hubContext.Clients.Group(request.GroupName).SendAsync("ReceiveMessage", new
            {
                Title = request.Title,
                Message = request.Message,
                GroupName = request.GroupName,
                Type = request.Type ?? "info",
                Timestamp = DateTime.UtcNow,
                Sender = User.Identity?.Name ?? "System"
            });

            _logger.LogInformation($"Notification sent to group {request.GroupName}: {request.Title}");
            return Ok(new { message = "Notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to group {request.GroupName}");
            return StatusCode(500, new { message = "Failed to send notification" });
        }
    }

    /// <summary>
    /// Send system notification (high priority)
    /// </summary>
    /// <param name="request">System notification request</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("system-notification")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> SendSystemNotification([FromBody] SystemNotificationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _hubContext.Clients.All.SendAsync("SystemNotification", new
            {
                Title = request.Title,
                Message = request.Message,
                Type = "system",
                Priority = request.Priority ?? "high",
                Timestamp = DateTime.UtcNow,
                RequiresAcknowledgment = request.RequiresAcknowledgment
            });

            // Store system notification in Redis for persistence
            await _redisService.SetAsync($"system_notification_{DateTime.UtcNow:yyyyMMddHHmmss}", new
            {
                Title = request.Title,
                Message = request.Message,
                Priority = request.Priority ?? "high",
                Timestamp = DateTime.UtcNow,
                RequiresAcknowledgment = request.RequiresAcknowledgment
            }, TimeSpan.FromDays(7)); // Keep for 7 days

            _logger.LogInformation($"System notification sent: {request.Title}");
            return Ok(new { message = "System notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending system notification");
            return StatusCode(500, new { message = "Failed to send system notification" });
        }
    }

    /// <summary>
    /// Get notification history from Redis
    /// </summary>
    /// <returns>List of recent notifications</returns>
    [HttpGet("history")]
    public async Task<ActionResult> GetNotificationHistory()
    {
        try
        {
            var notifications = new List<object>();
            
            // This is a simplified example - in a real application, you'd have a more sophisticated storage mechanism
            var keys = new[] { "notifications" }; // You would get actual keys from Redis
            
            foreach (var key in keys)
            {
                var notification = await _redisService.GetAsync<object>(key);
                if (notification != null)
                {
                    notifications.Add(notification);
                }
            }

            return Ok(notifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving notification history");
            return StatusCode(500, new { message = "Failed to retrieve notification history" });
        }
    }

    /// <summary>
    /// Test SignalR connection
    /// </summary>
    /// <returns>Test message</returns>
    [HttpPost("test")]
    public async Task<ActionResult> TestSignalR()
    {
        try
        {
            await _hubContext.Clients.All.SendAsync("TestMessage", new
            {
                Message = "SignalR is working correctly!",
                Timestamp = DateTime.UtcNow,
                From = "Test Controller"
            });

            return Ok(new { message = "Test message sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing SignalR");
            return StatusCode(500, new { message = "SignalR test failed" });
        }
    }
}

// Request DTOs
public class BroadcastNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Type { get; set; }
}

public class UserNotificationRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Type { get; set; }
}

public class RoleNotificationRequest
{
    public string Role { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Type { get; set; }
}

public class GroupNotificationRequest
{
    public string GroupName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Type { get; set; }
}

public class SystemNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public bool RequiresAcknowledgment { get; set; } = false;
}