using FullStackApp.Core.DTOs;
using FullStackApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FullStackApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;
    private readonly RedisService _redisService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        ProductService productService, 
        RedisService redisService,
        ILogger<ProductsController> logger)
    {
        _productService = productService;
        _redisService = redisService;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with caching
    /// </summary>
    /// <returns>List of products</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            const string cacheKey = "products_all";
            
            // Try to get from cache first
            var cachedProducts = await _redisService.GetAsync<IEnumerable<ProductDto>>(cacheKey);
            if (cachedProducts != null)
            {
                _logger.LogInformation("Products retrieved from cache");
                return Ok(cachedProducts);
            }

            // If not in cache, get from database
            var products = await _productService.GetAllAsync();
            
            // Cache for 5 minutes
            await _redisService.SetAsync(cacheKey, products, TimeSpan.FromMinutes(5));
            
            _logger.LogInformation($"Retrieved {products.Count()} products from database");
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, new { message = "An error occurred while retrieving products" });
        }
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var cacheKey = $"product_{id}";
            
            // Try cache first
            var cachedProduct = await _redisService.GetAsync<ProductDto>(cacheKey);
            if (cachedProduct != null)
            {
                return Ok(cachedProduct);
            }

            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Cache for 10 minutes
            await _redisService.SetAsync(cacheKey, product, TimeSpan.FromMinutes(10));
            
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving product with ID {id}");
            return StatusCode(500, new { message = "An error occurred while retrieving the product" });
        }
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    /// <param name="createProductDto">Product creation details</param>
    /// <returns>Created product</returns>
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
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

            var product = await _productService.CreateAsync(createProductDto, userId);
            
            // Invalidate cache
            await _redisService.DeleteAsync("products_all");
            
            _logger.LogInformation($"Product created successfully: {product.Name}");
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, new { message = "An error occurred while creating the product" });
        }
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="updateProductDto">Product update details</param>
    /// <returns>Updated product</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.UpdateAsync(id, updateProductDto);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Invalidate cache
            await _redisService.DeleteAsync("products_all", $"product_{id}");
            
            _logger.LogInformation($"Product updated successfully: {product.Name}");
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating product with ID {id}");
            return StatusCode(500, new { message = "An error occurred while updating the product" });
        }
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Success confirmation</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        try
        {
            var result = await _productService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Invalidate cache
            await _redisService.DeleteAsync("products_all", $"product_{id}");
            
            _logger.LogInformation($"Product deleted successfully: ID {id}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting product with ID {id}");
            return StatusCode(500, new { message = "An error occurred while deleting the product" });
        }
    }

    /// <summary>
    /// Get products count
    /// </summary>
    /// <returns>Total products count</returns>
    [HttpGet("count")]
    [AllowAnonymous]
    public async Task<ActionResult<int>> GetProductsCount()
    {
        try
        {
            const string cacheKey = "products_count";
            
            var cachedCount = await _redisService.GetAsync<int?>(cacheKey);
            if (cachedCount.HasValue)
            {
                return Ok(cachedCount.Value);
            }

            var count = await _productService.CountAsync();
            await _redisService.SetAsync(cacheKey, count, TimeSpan.FromMinutes(5));
            
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products count");
            return StatusCode(500, new { message = "An error occurred while retrieving products count" });
        }
    }
}