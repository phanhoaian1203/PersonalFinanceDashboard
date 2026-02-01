using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface ICategoryRepository
    {
        // Lấy danh sách danh mục của User (để đổ vào Dropdown)
        Task<IEnumerable<Category>> GetAllByUserIdAsync(int userId);

        // (Có thể mở rộng thêm tính năng Tạo/Sửa danh mục sau này)
    }
}