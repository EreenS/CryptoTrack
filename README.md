# 📈 CryptoTrack: Real-Time Crypto Portfolio & Tracker

**CryptoTrack**, modern teknolojilerle geliştirilmiş, kripto paraların anlık takibini yapan ve kullanıcıya özel favori listesi sunan **Full-Stack** bir borsa terminalidir.   
Bu proje geliştirilirken RESTful API standartları, Asenkron Programlama ve Hata Yönetimi (Rate Limit, SSL Handshake vb.) konularına özellikle dikkat edilmiştir. Backend tarafındaki veriler, güvenli bir şekilde SQLite veritabanında saklanmakta ve Frontend ile fetch API üzerinden haberleşmektedir.

---

## 🚀 Öne Çıkan Özellikler

* **Canlı Veri Akışı:** CoinGecko API entegrasyonu ile 30 saniyede bir güncellenen anlık fiyat verileri.
* **Favori Sistemi (Persistence):** SQLite veritabanı desteği sayesinde sayfa yenilense bile kaybolmayan, kullanıcıya özel favori listesi yönetimi.
* **Dinamik Detay Paneli:** Seçilen coin hakkında piyasa değeri, 24 saatlik değişim oranları ve piyasa sıralaması gibi derinlemesine analiz verileri.
* **Trend Analizi:** Son 24 saatte en çok yükselen (Top Gainers) coinlerin otomatik olarak filtrelenip listelenmesi.
* **Çift Tema Desteği:** Kullanıcı deneyimini artırmak için geliştirilmiş, göz yormayan **Koyu (Dark)** ve **Aydınlık (Light)** tema geçiş özelliği.
* **Modern UI/UX:** Tailwind CSS kullanılarak oluşturulmuş, "Glassmorphism" odaklı şeffaf ve estetik arayüz tasarımı.

---

## 🛠️ Teknolojik Yığın (Tech Stack)

### **Frontend**
* **React.js:** Dinamik ve hızlı bileşen yönetimi.
* **Tailwind CSS:** Modern ve esnek stil yönetimi.
* **Vite:** Yüksek performanslı geliştirme ve derleme ortamı.

### **Backend**
* **.NET 8 Web API:** Yüksek performanslı ve ölçeklenebilir sunucu mimarisi.
* **Entity Framework Core:** Veritabanı yönetiminde modern ORM yaklaşımı.
* **SQLite:** Hafif, hızlı ve güvenilir dosya tabanlı veritabanı çözümü.

---

## 📦 Kurulum ve Çalıştırma

### **1. Backend Hazırlığı**
```bash
cd backend
# Veritabanını oluşturun
dotnet ef database update  
# Uygulamayı başlatın
dotnet run
```
### **2. Frontend Hazırlığı**
```bash
cd frontend
# Bağımlılıkları yükleyin
npm install                
# Geliştirme sunucusunu başlatın
npm run dev
```
