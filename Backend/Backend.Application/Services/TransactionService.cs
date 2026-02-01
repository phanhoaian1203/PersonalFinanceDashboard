using Backend.Application.DTOs;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;

namespace Backend.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repository;
        private readonly ICategoryRepository _categoryRepository; 

        public TransactionService(ITransactionRepository repository, ICategoryRepository categoryRepository)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<TransactionDto>> GetAllByUserIdAsync(int userId)
        {
            var transactions = await _repository.GetAllByUserIdAsync(userId);

            // LOGIC MAPPING: Chuyển Entity sang DTO tại đây (Giải phóng cho Controller)
            return transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Description = t.Description ?? "",
                Date = t.Date,
                CategoryName = t.Category?.Name ?? "Không xác định",
                Type = t.Category?.Type ?? "Expense",
                Color = t.Category?.Color
            });
        }

        public async Task<TransactionDto> CreateAsync(CreateTransactionDto createDto, int userId)
        {
            // LOGIC NGHIỆP VỤ: Ví dụ kiểm tra đơn giản
            if (createDto.Amount <= 0)
            {
                throw new Exception("Số tiền phải lớn hơn 0 (Logic này nên check ở Service)");
            }

            // Mapping từ DTO sang Entity
            var entity = new Transaction
            {
                Amount = createDto.Amount,
                Description = createDto.Description,
                Date = createDto.Date,
                CategoryId = createDto.CategoryId,
                UserId = userId
            };

            await _repository.AddAsync(entity);

            // Trả về DTO kết quả
            return new TransactionDto
            {
                Id = entity.Id,
                Amount = entity.Amount,
                Date = entity.Date
                // ... map nốt các trường khác nếu cần
            };
        }

        public async Task UpdateAsync(int id, CreateTransactionDto updateDto, int userId)
        {
            var transaction = await _repository.GetByIdAsync(id, userId);
            if (transaction == null) throw new KeyNotFoundException("Giao dịch không tồn tại");

            // Cập nhật dữ liệu
            transaction.Amount = updateDto.Amount;
            transaction.Description = updateDto.Description;
            transaction.Date = updateDto.Date;
            transaction.CategoryId = updateDto.CategoryId;

            await _repository.UpdateAsync(transaction);
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var transaction = await _repository.GetByIdAsync(id, userId);
            if (transaction == null) throw new KeyNotFoundException("Giao dịch không tồn tại");

            await _repository.DeleteAsync(transaction);
        }
    }
}