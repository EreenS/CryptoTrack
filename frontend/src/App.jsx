import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#eee', padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>📈 CryptoTrack Canlı</h1>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Coin veya Sembol ara... (Örn: BTC, Solana)"
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: '1px solid #333',
            backgroundColor: '#1a1a1a',
            color: 'white',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#252525' }}>
              <tr>
                <th style={{ padding: '20px' }}>Coin</th>
                <th>Fiyat (USD)</th>
                <th>24s Değişim</th>
                <th>Piyasa Değeri</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map(coin => (
                <tr key={coin.id} style={{ borderBottom: '1px solid #333', transition: '0.3s' }}>
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={coin.image} width="30" alt={coin.name} />
                    <strong>{coin.name}</strong> <span style={{ color: '#666' }}>{coin.symbol.toUpperCase()}</span>
                  </td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td style={{ color: coin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                    {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td style={{ color: '#aaa' }}>${coin.market_cap.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCoins.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Aradığın coin bulunamadı usta...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App