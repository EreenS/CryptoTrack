import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null) // Seçili coini tutar

  useEffect(() => {
    const fetchCoins = () => {
      fetch('http://localhost:5012/api/Crypto')
        .then(res => res.json())
        .then(data => setCoins(data))
        .catch(err => console.error("Veri çekilemedi:", err));
    };
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#eee', fontFamily: 'Inter, Arial' }}>
      
      {/* SOL TARAF: LİSTE PANELİ */}
      <div style={{ width: '400px', borderRight: '1px solid #222', padding: '20px', overflowY: 'auto', height: '100vh' }}>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>📈 CryptoTrack</h2>
        
        <input
          type="text"
          placeholder="Ara... (BTC, ETH)"
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCoins.map(coin => (
            <div 
              key={coin.id}
              onClick={() => setSelectedCoin(coin)}
              style={{
                padding: '15px',
                borderRadius: '10px',
                backgroundColor: selectedCoin?.id === coin.id ? '#1a1a1a' : 'transparent',
                border: selectedCoin?.id === coin.id ? '1px solid #444' : '1px solid transparent',
                cursor: 'pointer',
                transition: '0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={coin.image} width="25" alt="" />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{coin.symbol.toUpperCase()}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{coin.name}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>${coin.current_price.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: coin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336' }}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ TARAF: DETAY PANELİ */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {selectedCoin ? (
          <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img src={selectedCoin.image} width="100" style={{ marginBottom: '20px' }} alt="" />
              <h1 style={{ fontSize: '3rem', margin: 0 }}>{selectedCoin.name}</h1>
              <span style={{ color: '#666', fontSize: '1.2rem' }}>{selectedCoin.symbol.toUpperCase()} / USD</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <DetailBox label="Güncel Fiyat" value={`$${selectedCoin.current_price.toLocaleString()}`} color="#eee" />
              <DetailBox label="24s Değişim" value={`%${selectedCoin.price_change_percentage_24h.toFixed(2)}`} color={selectedCoin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336'} />
              <DetailBox label="Piyasa Değeri" value={`$${selectedCoin.market_cap.toLocaleString()}`} color="#aaa" />
              <DetailBox label="24s En Yüksek" value={`$${selectedCoin.high_24h.toLocaleString()}`} color="#4caf50" />
              <DetailBox label="24s En Düşük" value={`$${selectedCoin.low_24h.toLocaleString()}`} color="#f44336" />
              <DetailBox label="Piyasa Sıralaması" value={`#${selectedCoin.market_cap_rank}`} color="#ffa726" />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#444' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📊</div>
            <h2>Lütfen detaylarını görmek istediğiniz bir coin seçin</h2>
            <p>Canlı veriler her 30 saniyede bir güncellenmektedir.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Yardımcı Bileşen: Detay kutucukları için
function DetailBox({ label, value, color }) {
  return (
    <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
      <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  )
}

export default App