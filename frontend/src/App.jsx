import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  // 1. Favorileri tutacak yeni bir state ekliyoruz
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Mevcut coin çekme fonksiyonu
    const fetchCoins = () => {
      fetch('http://localhost:5012/api/Crypto')
        .then(res => res.json())
        .then(data => setCoins(data))
        .catch(err => console.error("Veri çekilemedi:", err));
    };

    // 2. Favorileri Backend'den çekme fonksiyonu
    const fetchFavorites = () => {
      fetch('http://localhost:5012/api/Favorites')
        .then(res => res.json())
        .then(data => {
          // Gelen veri [{id:1, coinId:"bitcoin"}] formatında, bize sadece isimler lazım
          setFavorites(data.map(f => f.coinId));
        })
        .catch(err => console.error("Favoriler çekilemedi:", err));
    };

    fetchCoins();
    fetchFavorites();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Favori Ekleme/Çıkarma fonksiyonu
  const toggleFavorite = (e, coinId) => {
    e.stopPropagation(); // Tıklayınca detay sayfası açılmasın, sadece yıldız işlesin
    
    const isFav = favorites.includes(coinId);
    
    if (isFav) {
      // Favoriden Çıkar (DELETE)
      fetch(`http://localhost:5012/api/Favorites/${coinId}`, { method: 'DELETE' })
        .then(() => setFavorites(favorites.filter(id => id !== coinId)));
    } else {
      // Favoriye Ekle (POST)
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
      
      {/* SOL TARAFI */}
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
                {/* 4. YILDIZ BUTONU */}
                <button 
                  onClick={(e) => toggleFavorite(e, coin.id)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
                    color: favorites.includes(coin.id) ? '#ffa726' : '#444',
                    transition: '0.2s'
                  }}
                >
                  {favorites.includes(coin.id) ? '★' : '☆'}
                </button>
                <img src={coin.image} width="25" alt="" />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{coin.symbol.toUpperCase()}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>${coin.current_price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORTA PANEL */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {selectedCoin ? (
          <div style={{ width: '100%', maxWidth: '700px' }}>
             <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src={selectedCoin.image} width="100" style={{ marginBottom: '20px' }} alt="" />
                <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{selectedCoin.name}</h1>
                <p>{selectedCoin.symbol.toUpperCase()} / USD</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <DetailBox label="Fiyat" value={`$${selectedCoin.current_price.toLocaleString()}`} color="#eee" />
                <DetailBox label="24s Değişim" value={`%${selectedCoin.price_change_percentage_24h.toFixed(2)}`} color={selectedCoin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336'} />
             </div>
          </div>
        ) : (
          <h2>Coin Detay</h2>
        )}
      </div>

      {/* SAĞ PANEL */}
      <div style={{ width: '320px', borderLeft: '1px solid #222', padding: '20px', backgroundColor: '#0d0d0d' }}>
         <h3 style={{ color: '#ffa726' }}>⭐ Favori Takibin</h3>
         <p style={{ fontSize: '0.8rem', color: '#666' }}>Hafızaya alınan coinler:</p>
         <div style={{ marginTop: '15px' }}>
            {favorites.map(favId => (
              <div key={favId} style={{ padding: '8px', borderBottom: '1px solid #222', color: '#aaa' }}>
                • {favId.toUpperCase()}
              </div>
            ))}
         </div>
      </div>

    </div>
  )
}

function DetailBox({ label, value, color }) {
  return (
    <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
      <div style={{ color: '#666', fontSize: '0.9rem' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  )
}

export default App