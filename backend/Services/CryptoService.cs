using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Services;

public class CryptoService
{
    private readonly HttpClient _httpClient;

    // Burada HttpClient yerine IHttpClientFactory alıyoruz usta
    public CryptoService(IHttpClientFactory httpClientFactory)
    {
        // Program.cs'de "SSL_Cozucu" adıyla kaydettiğimiz ayarlı istemciyi çağırıyoruz
        _httpClient = httpClientFactory.CreateClient("SSL_Cozucu");
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
                Console.WriteLine("⚠️ CoinGecko Hız Sınırı: Çok fazla istek atıldı. Biraz bekle.");
                return "[]"; 
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (Exception ex)
        {
            // Artık o SSL hatası buraya düşecek ama Program.cs ayarıyla bunu aşacağız
            Console.WriteLine($"❌ Hata oluştu: {ex.Message}");
            return "[]"; 
        }
    }
}