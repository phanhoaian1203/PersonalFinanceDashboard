namespace Backend.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
 
        public ICollection<Category> Categories { get; set; } = new List<Category>();

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}