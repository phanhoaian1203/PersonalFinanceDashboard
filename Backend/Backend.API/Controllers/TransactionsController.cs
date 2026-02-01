using Backend.Application.DTOs;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionsController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        // GET: api/transactions?userId=1
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int userId = 1)
        {
            // Lưu ý: Tạm thời mặc định userId = 1 để test. 
            // Sau này có chức năng Đăng nhập (Auth), ta sẽ lấy userId từ Token.

            var transactions = await _transactionRepository.GetAllByUserIdAsync(userId);

            // Mapping: Chuyển từ Entity sang DTO để trả về Frontend
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Description = t.Description ?? "",
                Date = t.Date,
                CategoryName = t.Category?.Name ?? "Không xác định", // Lấy tên Category
                Type = t.Category?.Type ?? "Expense",
                Color = t.Category?.Color
            });

            return Ok(transactionDtos);
        }

        // POST: api/transactions
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransactionDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Mapping: Chuyển từ DTO (Frontend gửi lên) thành Entity (để lưu DB)
            var transactionEntity = new Transaction
            {
                Amount = createDto.Amount,
                Description = createDto.Description,
                Date = createDto.Date,
                CategoryId = createDto.CategoryId,
                UserId = 1 // Tạm thời hard-code là 1 (sẽ sửa khi làm Auth)
            };

            try
            {
                await _transactionRepository.AddAsync(transactionEntity);
                return CreatedAtAction(nameof(GetAll), new { id = transactionEntity.Id }, transactionEntity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi Server: {ex.Message}");
            }
        }
    }
}