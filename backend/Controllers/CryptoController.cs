using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CryptoController : ControllerBase
{
    private readonly CryptoService _cryptoService;

    public CryptoController(CryptoService cryptoService)
    {
        _cryptoService = cryptoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCoins()
    {
        // Servise gidip canlı JSON verisini çekiyoruz
        var data = await _cryptoService.GetTopCoinsAsync();
        
        // Bu veriyi React'e paslıyoruz
        return Ok(data);
    }
}