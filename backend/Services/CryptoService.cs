using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Services;

public class CryptoService
{
    private readonly HttpClient _httpClient;

    public CryptoService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "CryptoTrackApp");
    }

    public async Task<string> GetTopCoinsAsync()
    {
        var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
        
        return await _httpClient.GetStringAsync(url);
    }
}