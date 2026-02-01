using Backend.Application.DTOs;

namespace Backend.Application.Interfaces
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionDto>> GetAllByUserIdAsync(int userId);
        Task<TransactionDto> CreateAsync(CreateTransactionDto createDto, int userId);
        Task UpdateAsync(int id, CreateTransactionDto updateDto, int userId);
        Task DeleteAsync(int id, int userId);
    }
}