import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [favorites, setFavorites] = useState([])
  // TEMA STATE'I: Varsayılan koyu mod
  const [isDarkMode, setIsDarkMode] = useState(true)

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
        .then(data => setFavorites(data.map(f => f.coinId)))
        .catch(err => console.error("Favoriler çekilemedi:", err));
    };

    fetchCoins();
    fetchFavorites();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  // Renk Paleti (Tema değişkenlerine göre)
  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
    sidebar: isDarkMode ? '#0d0d0d' : '#ffffff',
    text: isDarkMode ? '#eee' : '#1a1a1a',
    border: isDarkMode ? '#222' : '#ddd',
    card: isDarkMode ? '#111' : '#fff',
    subText: isDarkMode ? '#666' : '#888'
  }

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
      }).then(() => setFavorites([...favorites, coinId]));
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', backgroundColor: theme.bg, width: '100vw', minHeight: '100vh', color: theme.text, fontFamily: 'Inter, Arial', overflow: 'hidden', transition: '0.3s' }}>
      
      {/* SOL PANEL */}
      <div style={{ width: '380px', minWidth: '380px', borderRight: `1px solid ${theme.border}`, padding: '20px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box', backgroundColor: theme.sidebar }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>📈 CryptoTrack</h2>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ padding: '8px 12px', borderRadius: '20px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, cursor: 'pointer', fontSize: '1rem' }}
          >
            {isDarkMode ? '☀️ Aydınlık' : '🌙 Koyu'}
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Ara..."
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCoins.map(coin => (
            <div 
              key={coin.id}
              onClick={() => setSelectedCoin(coin)}
              style={{
                padding: '15px', borderRadius: '10px',
                backgroundColor: selectedCoin?.id === coin.id ? (isDarkMode ? '#1a1a1a' : '#e0e0e0') : 'transparent',
                border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={(e) => toggleFavorite(e, coin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: favorites.includes(coin.id) ? '#ffa726' : theme.subText }}>
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
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {selectedCoin ? (
          <div style={{ width: '100%', maxWidth: '700px' }}>
             <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src={selectedCoin.image} width="100" style={{ marginBottom: '20px' }} alt="" />
                <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{selectedCoin.name}</h1>
                <p style={{ color: theme.subText }}>{selectedCoin.symbol.toUpperCase()} / USD</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <DetailBox label="Güncel Fiyat" value={`$${selectedCoin.current_price?.toLocaleString()}`} color={theme.text} theme={theme} />
                <DetailBox label="24s Değişim" value={`%${selectedCoin.price_change_percentage_24h?.toFixed(2)}`} color={selectedCoin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336'} theme={theme} />
                <DetailBox label="Piyasa Değeri" value={`$${selectedCoin.market_cap?.toLocaleString()}`} color={theme.subText} theme={theme} />
                <DetailBox label="Sıralama" value={`#${selectedCoin.market_cap_rank}`} color="#ffa726" theme={theme} />
             </div>
          </div>
        ) : (
          <h2 style={{ color: theme.subText }}>Analiz için bir coin seç usta!</h2>
        )}
      </div>

      {/* SAĞ PANEL */}
      <div style={{ width: '320px', minWidth: '320px', borderLeft: `1px solid ${theme.border}`, padding: '20px', backgroundColor: theme.sidebar, overflowY: 'auto' }}>
         <h3 style={{ color: '#ffa726', marginBottom: '15px' }}>⭐ Favori Takibin</h3>
         <div style={{ marginBottom: '30px' }}>
            {favorites.map(favId => (
              <div key={favId} style={{ padding: '10px', backgroundColor: theme.card, borderRadius: '8px', marginBottom: '8px', border: `1px solid ${theme.border}`, color: theme.text, fontSize: '0.9rem' }}>
                • {favId.toUpperCase()}
              </div>
            ))}
         </div>
         <hr style={{ border: '0', borderTop: `1px solid ${theme.border}`, margin: '20px 0' }} />
         <h3 style={{ color: '#ff5722', marginBottom: '15px' }}>🔥 Trend Olanlar</h3>
         {coins.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0,3).map(coin => (
           <div key={coin.id} style={{ backgroundColor: theme.card, padding: '12px', borderRadius: '10px', marginBottom: '10px', border: `1px solid ${theme.border}` }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ fontWeight: 'bold' }}>{coin.symbol.toUpperCase()}</span>
               <span style={{ color: '#4caf50' }}>+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  )
}

function DetailBox({ label, value, color, theme }) {
  return (
    <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
      <div style={{ color: theme.subText, fontSize: '0.8rem', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  )
}

export default App