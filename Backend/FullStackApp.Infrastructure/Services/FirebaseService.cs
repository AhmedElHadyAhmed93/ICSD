using FullStackApp.Core.Interfaces;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FullStackApp.Infrastructure.Services;

public class FirebaseService : ISingletonService
{
    private readonly FirebaseMessaging _messaging;
    private readonly ILogger<FirebaseService> _logger;

    public FirebaseService(IConfiguration configuration, ILogger<FirebaseService> logger)
    {
        _logger = logger;

        try
        {
            // Initialize Firebase Admin SDK
            var firebaseConfigPath = configuration["Firebase:ServiceAccountKeyPath"];
            
            if (string.IsNullOrEmpty(firebaseConfigPath))
            {
                // For development, you can use a default credential
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = GoogleCredential.GetApplicationDefault(),
                    });
                }
            }
            else
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = GoogleCredential.FromFile(firebaseConfigPath),
                    });
                }
            }

            _messaging = FirebaseMessaging.DefaultInstance;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize Firebase Admin SDK");
            throw;
        }
    }

    public async Task<string> SendNotificationAsync(string token, string title, string body, Dictionary<string, string>? data = null)
    {
        try
        {
            var message = new Message()
            {
                Token = token,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body,
                },
                Data = data ?? new Dictionary<string, string>(),
                Android = new AndroidConfig()
                {
                    Notification = new AndroidNotification()
                    {
                        Icon = "stock_ticker_update",
                        Color = "#f45342",
                        Sound = "default"
                    }
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps()
                    {
                        Alert = new ApsAlert()
                        {
                            Title = title,
                            Body = body
                        },
                        Badge = 1,
                        Sound = "default"
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            _logger.LogInformation($"Successfully sent message: {response}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Firebase notification");
            throw;
        }
    }

    public async Task<BatchResponse> SendMulticastNotificationAsync(
        IEnumerable<string> tokens, 
        string title, 
        string body, 
        Dictionary<string, string>? data = null)
    {
        try
        {
            var message = new MulticastMessage()
            {
                Tokens = tokens.ToList(),
                Notification = new Notification()
                {
                    Title = title,
                    Body = body,
                },
                Data = data ?? new Dictionary<string, string>(),
                Android = new AndroidConfig()
                {
                    Notification = new AndroidNotification()
                    {
                        Icon = "stock_ticker_update",
                        Color = "#f45342",
                        Sound = "default"
                    }
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps()
                    {
                        Alert = new ApsAlert()
                        {
                            Title = title,
                            Body = body
                        },
                        Badge = 1,
                        Sound = "default"
                    }
                }
            };

            var response = await _messaging.SendMulticastAsync(message);
            _logger.LogInformation($"Successfully sent {response.SuccessCount} messages out of {tokens.Count()}");
            
            if (response.FailureCount > 0)
            {
                foreach (var error in response.Responses.Where(r => !r.IsSuccess))
                {
                    _logger.LogWarning($"Failed to send message: {error.Exception?.Message}");
                }
            }

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending multicast Firebase notification");
            throw;
        }
    }

    public async Task<string> SendTopicNotificationAsync(
        string topic, 
        string title, 
        string body, 
        Dictionary<string, string>? data = null)
    {
        try
        {
            var message = new Message()
            {
                Topic = topic,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body,
                },
                Data = data ?? new Dictionary<string, string>(),
                Android = new AndroidConfig()
                {
                    Notification = new AndroidNotification()
                    {
                        Icon = "stock_ticker_update",
                        Color = "#f45342",
                        Sound = "default"
                    }
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps()
                    {
                        Alert = new ApsAlert()
                        {
                            Title = title,
                            Body = body
                        },
                        Badge = 1,
                        Sound = "default"
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            _logger.LogInformation($"Successfully sent topic message: {response}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Firebase topic notification");
            throw;
        }
    }

    public async Task<TopicManagementResponse> SubscribeToTopicAsync(IEnumerable<string> tokens, string topic)
    {
        try
        {
            var response = await _messaging.SubscribeToTopicAsync(tokens.ToList(), topic);
            _logger.LogInformation($"Successfully subscribed {response.SuccessCount} tokens to topic {topic}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error subscribing to topic {topic}");
            throw;
        }
    }

    public async Task<TopicManagementResponse> UnsubscribeFromTopicAsync(IEnumerable<string> tokens, string topic)
    {
        try
        {
            var response = await _messaging.UnsubscribeFromTopicAsync(tokens.ToList(), topic);
            _logger.LogInformation($"Successfully unsubscribed {response.SuccessCount} tokens from topic {topic}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error unsubscribing from topic {topic}");
            throw;
        }
    }

    // Send data-only message (silent push)
    public async Task<string> SendDataOnlyNotificationAsync(string token, Dictionary<string, string> data)
    {
        try
        {
            var message = new Message()
            {
                Token = token,
                Data = data,
                Android = new AndroidConfig()
                {
                    Priority = Priority.High
                },
                Apns = new ApnsConfig()
                {
                    Headers = new Dictionary<string, string>()
                    {
                        { "apns-priority", "10" },
                        { "apns-push-type", "background" }
                    },
                    Aps = new Aps()
                    {
                        ContentAvailable = true
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            _logger.LogInformation($"Successfully sent data-only message: {response}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending data-only Firebase notification");
            throw;
        }
    }
}