import { useEffect, useState } from 'react'

function App() {
  const [coins, setCoins] = useState([])

  useEffect(() => {
    // Backend'den canlı verileri çekiyoruz
    fetch('http://localhost:5012/api/Crypto')
      .then(res => res.json())
      .then(data => setCoins(data))
  }, [])

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#eee', padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>📈 CryptoTrack Canlı</h1>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#252525' }}>
            <tr>
              <th style={{ padding: '15px' }}>Coin</th>
              <th>Fiyat (USD)</th>
              <th>24s Değişim</th>
              <th>Piyasa Değeri</th>
            </tr>
          </thead>
          <tbody>
            {coins.map(coin => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={coin.image} width="30" alt={coin.name} />
                  <strong>{coin.name}</strong> <span style={{ color: '#666' }}>{coin.symbol.toUpperCase()}</span>
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td style={{ color: coin.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336' }}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td style={{ color: '#aaa' }}>${coin.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App