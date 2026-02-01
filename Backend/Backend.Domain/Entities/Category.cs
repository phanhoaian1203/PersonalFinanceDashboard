using System.Text.Json.Serialization;

namespace Backend.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; 
        public string Type { get; set; } = "Expense";

        public string? Icon { get; set; }
        public string? Color { get; set; }

        public int UserId { get; set; }

        [JsonIgnore] // Tránh vòng lặp khi serialize JSON
        public User? User { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}