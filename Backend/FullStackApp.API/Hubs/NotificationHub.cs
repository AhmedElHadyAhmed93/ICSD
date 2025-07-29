using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FullStackApp.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("UserJoined", $"{Context.User?.Identity?.Name} joined the group {groupName}");
    }

    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("UserLeft", $"{Context.User?.Identity?.Name} left the group {groupName}");
    }

    public async Task SendMessageToGroup(string groupName, string message)
    {
        var userName = Context.User?.Identity?.Name ?? "Anonymous";
        await Clients.Group(groupName).SendAsync("ReceiveMessage", userName, message, DateTime.UtcNow);
    }

    public async Task SendMessageToUser(string userId, string message)
    {
        var senderName = Context.User?.Identity?.Name ?? "Anonymous";
        await Clients.User(userId).SendAsync("ReceivePrivateMessage", senderName, message, DateTime.UtcNow);
    }

    public async Task SendNotificationToAll(string title, string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", new
        {
            Title = title,
            Message = message,
            Timestamp = DateTime.UtcNow,
            Type = "info"
        });
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.Identity?.Name;

        if (!string.IsNullOrEmpty(userId))
        {
            // Add user to their personal group for targeted notifications
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        // Notify all clients about the new connection
        await Clients.All.SendAsync("UserConnected", new
        {
            UserName = userName,
            ConnectionId = Context.ConnectionId,
            Timestamp = DateTime.UtcNow
        });

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.Identity?.Name;

        if (!string.IsNullOrEmpty(userId))
        {
            // Remove user from their personal group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        // Notify all clients about the disconnection
        await Clients.All.SendAsync("UserDisconnected", new
        {
            UserName = userName,
            ConnectionId = Context.ConnectionId,
            Timestamp = DateTime.UtcNow
        });

        await base.OnDisconnectedAsync(exception);
    }

    // Method to broadcast system notifications
    public async Task BroadcastSystemNotification(string title, string message, string type = "info")
    {
        await Clients.All.SendAsync("SystemNotification", new
        {
            Title = title,
            Message = message,
            Type = type,
            Timestamp = DateTime.UtcNow
        });
    }

    // Method to send notifications to specific roles
    public async Task SendNotificationToRole(string role, string title, string message)
    {
        await Clients.Group($"role_{role}").SendAsync("RoleNotification", new
        {
            Title = title,
            Message = message,
            Role = role,
            Timestamp = DateTime.UtcNow
        });
    }

    // Method to join role-based groups
    public async Task JoinRoleGroup(string role)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"role_{role}");
    }

    // Method to leave role-based groups
    public async Task LeaveRoleGroup(string role)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"role_{role}");
    }
}