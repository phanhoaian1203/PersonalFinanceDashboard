using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaction>> GetAllByUserIdAsync(int userId);

        Task<Transaction?> GetByIdAsync(int id, int userId);

        Task AddAsync(Transaction transaction);

        Task UpdateAsync(Transaction transaction);

        Task DeleteAsync(Transaction transaction);
    }
}