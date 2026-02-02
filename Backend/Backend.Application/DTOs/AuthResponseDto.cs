namespace Backend.Application.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty; // Chuỗi JWT
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}