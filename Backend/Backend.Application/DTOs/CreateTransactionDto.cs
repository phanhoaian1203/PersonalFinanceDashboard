using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs
{
    public class CreateTransactionDto
    {
        [Required(ErrorMessage = "Số tiền không được để trống")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn 0")]
        public decimal Amount { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }
    }
}