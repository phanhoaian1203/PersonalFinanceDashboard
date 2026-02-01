using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ==============================================
// PHẦN 1: ĐĂNG KÝ DỊCH VỤ (SERVICES)
// (Phải làm trước khi builder.Build())
// ==============================================

// 1. Thêm Controllers (Quan trọng cho dự án lớn)
builder.Services.AddControllers();

// 2. Cấu hình Swagger (Tài liệu API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Thêm dịch vụ CORS (Sửa lỗi vị trí cũ)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Cho phép Frontend gọi vào
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ==============================================
// PHẦN 2: XÂY DỰNG ỨNG DỤNG
// ==============================================
var app = builder.Build();

// ==============================================
// PHẦN 3: CẤU HÌNH PIPELINE (MIDDLEWARE)
// ==============================================

// Cấu hình môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Kích hoạt CORS (Nên đặt trước Authorization)
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Map các Controllers vào ứng dụng
app.MapControllers();

app.Run();