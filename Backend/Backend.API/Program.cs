using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Infrastructure.Data;
using Backend.Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ==============================================
// PHẦN 1: ĐĂNG KÝ DỊCH VỤ (SERVICES)
// (Phải làm trước khi builder.Build())
// ==============================================

// Thêm Controllers (Quan trọng cho dự án lớn)
builder.Services.AddControllers();

// Đăng ký kết nối Database (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Scoped: Mỗi một request (yêu cầu) gửi lên sẽ tạo mới một instance, xong thì hủy. Rất tiết kiệm bộ nhớ.
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Cấu hình Swagger (Tài liệu API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Thêm dịch vụ CORS (Sửa lỗi vị trí cũ)
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