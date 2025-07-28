using FullStackApp.Core.DTOs;
using FullStackApp.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace FullStackApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="registerDto">User registration details</param>
    /// <returns>Authentication token and user information</returns>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest(new { message = "User registration failed. Email might already be in use." });
            }

            _logger.LogInformation($"User registered successfully: {registerDto.Email}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error registering user: {registerDto.Email}");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    /// <summary>
    /// Login user
    /// </summary>
    /// <param name="loginDto">User login credentials</param>
    /// <returns>Authentication token and user information</returns>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            _logger.LogInformation($"User logged in successfully: {loginDto.Email}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error logging in user: {loginDto.Email}");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    /// <summary>
    /// Validate token endpoint (useful for checking if token is still valid)
    /// </summary>
    /// <returns>Current user information if token is valid</returns>
    [HttpGet("validate-token")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public ActionResult ValidateToken()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var firstName = User.FindFirst("firstName")?.Value;
            var lastName = User.FindFirst("lastName")?.Value;
            var roles = User.FindAll(System.Security.Claims.ClaimTypes.Role).Select(c => c.Value).ToList();

            return Ok(new
            {
                UserId = userId,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Roles = roles,
                IsValid = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return StatusCode(500, new { message = "An error occurred during token validation" });
        }
    }
}