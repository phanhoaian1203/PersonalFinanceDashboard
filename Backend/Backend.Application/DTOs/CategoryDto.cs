namespace Backend.Application.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Income" hoặc "Expense"
        public string? Icon { get; set; }
        public string? Color { get; set; }
    }
}