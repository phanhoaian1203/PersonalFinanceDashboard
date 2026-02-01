using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;

        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Transaction transaction)
        {
            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Transaction transaction)
        {
            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Transaction>> GetAllByUserIdAsync(int userId)
        {
            // Include(t => t.Category): Kỹ thuật Eager Loading để lấy luôn tên Category đi kèm
            return await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Date) 
                .ToListAsync();
        }

        public async Task<Transaction?> GetByIdAsync(int id, int userId)
        {
            // Phải check cả UserId để đảm bảo không lấy trộm giao dịch của người khác
            return await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task UpdateAsync(Transaction transaction)
        {
            _context.Transactions.Update(transaction);
            await _context.SaveChangesAsync();
        }
    }
}