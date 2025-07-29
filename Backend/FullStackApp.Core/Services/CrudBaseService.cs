using FullStackApp.Core.Interfaces;
using System.Linq.Expressions;

namespace FullStackApp.Core.Services;

public abstract class CrudBaseService<TEntity, TDto, TKey> : IScopedService
    where TEntity : class
    where TDto : class
{
    protected readonly IRepository<TEntity> _repository;

    protected CrudBaseService(IRepository<TEntity> repository)
    {
        _repository = repository;
    }

    public virtual async Task<TDto?> GetByIdAsync(TKey id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity != null ? MapToDto(entity) : null;
    }

    public virtual async Task<IEnumerable<TDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(MapToDto);
    }

    public virtual async Task<IEnumerable<TDto>> FindAsync(Expression<Func<TEntity, bool>> predicate)
    {
        var entities = await _repository.FindAsync(predicate);
        return entities.Select(MapToDto);
    }

    public virtual async Task<TDto> CreateAsync(TDto dto)
    {
        var entity = MapToEntity(dto);
        var createdEntity = await _repository.AddAsync(entity);
        return MapToDto(createdEntity);
    }

    public virtual async Task<TDto?> UpdateAsync(TKey id, TDto dto)
    {
        var existingEntity = await _repository.GetByIdAsync(id);
        if (existingEntity == null)
            return null;

        MapToExistingEntity(dto, existingEntity);
        await _repository.UpdateAsync(existingEntity);
        return MapToDto(existingEntity);
    }

    public virtual async Task<bool> DeleteAsync(TKey id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return false;

        await _repository.DeleteAsync(entity);
        return true;
    }

    public virtual async Task<bool> ExistsAsync(TKey id)
    {
        return await _repository.ExistsAsync(id);
    }

    public virtual async Task<int> CountAsync()
    {
        return await _repository.CountAsync();
    }

    // Abstract methods for mapping - to be implemented by concrete services
    protected abstract TDto MapToDto(TEntity entity);
    protected abstract TEntity MapToEntity(TDto dto);
    protected abstract void MapToExistingEntity(TDto dto, TEntity entity);
}