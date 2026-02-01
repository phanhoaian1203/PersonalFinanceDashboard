using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int userId = 1)
        {
            // Controller cực kỳ mỏng (Thin Controller), chỉ gọi và trả kết quả
            var result = await _categoryService.GetAllByUserIdAsync(userId);
            return Ok(result);
        }
    }
}