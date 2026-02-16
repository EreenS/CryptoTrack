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
        
        try 
        {
            var response = await _httpClient.GetAsync(url);

            if ((int)response.StatusCode == 429)
            {
                // Eğer hız sınırına takıldıysak hata fırlatmak yerine boş bir liste dönelim
                Console.WriteLine("⚠️ CoinGecko Hız Sınırı: Çok fazla istek atıldı. Biraz bekle.");
                return "[]"; 
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Hata oluştu: {ex.Message}");
            return "[]"; // Hata durumunda boş liste dön ki frontend çökmesin
        }
    }
}