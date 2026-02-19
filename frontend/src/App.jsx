import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const fetchCoins = () => {
      fetch('http://localhost:5012/api/Crypto')
        .then(res => res.json())
        .then(data => setCoins(data))
        .catch(err => console.error("Veri çekilemedi:", err));
    };

    const fetchFavorites = () => {
      fetch('http://localhost:5012/api/Favorites')
        .then(res => res.json())
        .then(data => {
          setFavorites(data.map(f => f.coinId));
        })
        .catch(err => console.error("Favoriler çekilemedi:", err));
    };

    fetchCoins();
    fetchFavorites();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (e, coinId) => {
    e.stopPropagation();
    const isFav = favorites.includes(coinId);
    
    if (isFav) {
      fetch(`http://localhost:5012/api/Favorites/${coinId}`, { method: 'DELETE' })
        .then(() => setFavorites(favorites.filter(id => id !== coinId)));
    } else {
      fetch('http://localhost:5012/api/Favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coinId)
      })
      .then(() => setFavorites([...favorites, coinId]));
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0a0a0a', width: '100vw', minHeight: '100vh', color: '#eee', fontFamily: 'Inter, Arial', overflow: 'hidden' }}>
      
      {/* SOL PANEL */}
      <div style={{ width: '380px', minWidth: '380px', borderRight: '1px solid #222', padding: '20px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        <h2 style={{ marginBottom: '20px' }}>📈 CryptoTrack</h2>
        <input
          type="text"
          placeholder="Ara..."
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
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
                border: '1px solid #222',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={(e) => toggleFavorite(e, coin.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: favorites.includes(coin.id) ? '#ffa726' : '#444' }}
                >
                  {favorites.includes(coin.id) ? '★' : '☆'}
                </button>
                <img src={coin.image} width="25" alt="" />
                <div style={{ fontWeight: 'bold' }}>{coin.symbol.toUpperCase()}</div>
              </div>
              <div style={{ fontWeight: 'bold' }}>${coin.current_price?.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ORTA PANEL */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
        {selectedCoin ? (
          <div style={{ width: '100%', maxWidth: '700px' }}>
             <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src={selectedCoin.image} width="100" style={{ marginBottom: '20px' }} alt="" />
                <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{selectedCoin.name}</h1>
                <p style={{ color: '#666' }}>{selectedCoin.symbol.toUpperCase()} / USD</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <DetailBox label="Güncel Fiyat" value={`$${selectedCoin.current_price?.toLocaleString()}`} color="#eee" />
                <DetailBox label="24s Değişim" value={`%${selectedCoin.price_change_percentage_24h?.toFixed(2)}`} color={selectedCoin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336'} />
                <DetailBox label="Piyasa Değeri" value={`$${selectedCoin.market_cap?.toLocaleString()}`} color="#aaa" />
                <DetailBox label="Sıralama" value={`#${selectedCoin.market_cap_rank}`} color="#ffa726" />
             </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#333' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Coin Detayı İçin Seçim Yap</h2>
          </div>
        )}
      </div>

      {/* SAĞ PANEL: FAVORİLER + TRENDLER */}
      <div style={{ width: '320px', minWidth: '320px', borderLeft: '1px solid #222', padding: '20px', backgroundColor: '#0d0d0d', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
         
         {/* ÜST KISIM: FAVORİLER */}
         <h3 style={{ color: '#ffa726', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>⭐ Favori Takibin</h3>
         <div style={{ marginBottom: '30px' }}>
            {favorites.length > 0 ? favorites.map(favId => (
              <div key={favId} style={{ padding: '10px', backgroundColor: '#161616', borderRadius: '8px', marginBottom: '8px', border: '1px solid #222', color: '#eee', fontSize: '0.9rem' }}>
                • {favId.toUpperCase()}
              </div>
            )) : <p style={{ color: '#444', fontSize: '0.8rem' }}>Favori coin seçilmedi.</p>}
         </div>

         <hr style={{ border: '0', borderTop: '1px solid #222', margin: '20px 0' }} />

         {/* ALT KISIM: TRENDLER (TOP GAINERS) */}
         <h3 style={{ color: '#ff5722', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>🔥 Trend Olanlar (24s)</h3>
         <div>
            {coins.length > 0 ? coins
              .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
              .slice(0, 3)
              .map(coin => (
                <div key={coin.id} style={{ backgroundColor: '#161616', padding: '12px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{coin.symbol.toUpperCase()}</span>
                    <span style={{ color: '#4caf50', fontSize: '0.85rem' }}>+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
                  </div>
                </div>
              )) : <p style={{ color: '#444', fontSize: '0.8rem' }}>Veri yükleniyor...</p>
            }
         </div>

         <hr style={{ border: '0', borderTop: '1px solid #222', margin: '20px 0' }} />

         {/* PİYASA ÖZETİ */}
         <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>Aktif Takip</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{coins.length} Coin</div>
         </div>
      </div>

    </div>
  )
}

function DetailBox({ label, value, color }) {
  return (
    <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
      <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  )
}

export default App