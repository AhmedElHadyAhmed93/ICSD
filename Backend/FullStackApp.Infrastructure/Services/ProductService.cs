using FullStackApp.Core.DTOs;
using FullStackApp.Core.Entities;
using FullStackApp.Core.Interfaces;
using FullStackApp.Core.Services;
using Microsoft.EntityFrameworkCore;

namespace FullStackApp.Infrastructure.Services;

public class ProductService : CrudBaseService<Product, ProductDto, int>
{
    public ProductService(IRepository<Product> repository) : base(repository)
    {
    }

    public override async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        // Override to include user information
        var products = await _repository.GetAllAsync();
        return products.Select(MapToDto);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto createDto, string userId)
    {
        var product = new Product
        {
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            Stock = createDto.Stock,
            ImageUrl = createDto.ImageUrl,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdProduct = await _repository.AddAsync(product);
        return MapToDto(createdProduct);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto updateDto)
    {
        var existingProduct = await _repository.GetByIdAsync(id);
        if (existingProduct == null)
            return null;

        existingProduct.Name = updateDto.Name;
        existingProduct.Description = updateDto.Description;
        existingProduct.Price = updateDto.Price;
        existingProduct.Stock = updateDto.Stock;
        existingProduct.ImageUrl = updateDto.ImageUrl;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existingProduct);
        return MapToDto(existingProduct);
    }

    protected override ProductDto MapToDto(Product entity)
    {
        return new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Price = entity.Price,
            Stock = entity.Stock,
            ImageUrl = entity.ImageUrl,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            CreatedByUserId = entity.CreatedByUserId,
            CreatedByUserName = entity.CreatedByUser?.UserName ?? ""
        };
    }

    protected override Product MapToEntity(ProductDto dto)
    {
        return new Product
        {
            Id = dto.Id,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            CreatedByUserId = dto.CreatedByUserId,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt
        };
    }

    protected override void MapToExistingEntity(ProductDto dto, Product entity)
    {
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.Price = dto.Price;
        entity.Stock = dto.Stock;
        entity.ImageUrl = dto.ImageUrl;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}