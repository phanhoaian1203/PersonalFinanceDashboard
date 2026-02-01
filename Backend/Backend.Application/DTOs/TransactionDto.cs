namespace Backend.Application.DTOs
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Income/Expense
        public string? Color { get; set; } 
    }
}