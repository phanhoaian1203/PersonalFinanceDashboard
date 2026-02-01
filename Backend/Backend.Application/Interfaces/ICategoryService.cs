using Backend.Application.DTOs;

namespace Backend.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllByUserIdAsync(int userId);
    }
}