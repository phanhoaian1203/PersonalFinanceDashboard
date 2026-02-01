using Backend.Application.DTOs;
using Backend.Application.Interfaces;

namespace Backend.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllByUserIdAsync(int userId)
        {
            var categories = await _categoryRepository.GetAllByUserIdAsync(userId);

            // Mapping Entity sang DTO
            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Type = c.Type,
                Icon = c.Icon,
                Color = c.Color
            });
        }
    }
}