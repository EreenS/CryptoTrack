using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FavoritesController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Favorileri Listele (GET: api/favorites)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Favorite>>> GetFavorites()
    {
        return await _context.Favorites.ToListAsync();
    }

    // 2. Favoriye Ekle (POST: api/favorites)
    [HttpPost]
    public async Task<ActionResult<Favorite>> AddFavorite([FromBody] string coinId)
    {
        // Zaten favorideyse tekrar ekleme
        var exists = await _context.Favorites.AnyAsync(f => f.CoinId == coinId);
        if (exists) return BadRequest("Bu coin zaten favorilerde.");

        var favorite = new Favorite { CoinId = coinId };
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return Ok(favorite);
    }

    // 3. Favoriden Çıkar (DELETE: api/favorites/{coinId})
    [HttpDelete("{coinId}")]
    public async Task<IActionResult> RemoveFavorite(string coinId)
    {
        var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.CoinId == coinId);
        if (favorite == null) return NotFound();

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}