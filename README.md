# library-ui

Next.js ile geliştirilmiş LibraryAPI frontend uygulaması.

## Teknolojiler

- **Next.js 16** — React framework
- **TypeScript** — Tip güvenliği
- **Tailwind CSS** — Stil
- **TanStack Query** — Sunucu verisi yönetimi
- **Axios** — HTTP istemcisi

## Özellikler

- Kitap, Yazar, Kategori listeleme
- Kitap arama ve filtreleme
- JWT tabanlı kimlik doğrulama
- Admin paneli — tam CRUD yönetimi
- Kullanıcı yönetimi (Admin yetki kontrolü)
- Dinamik Navbar — role göre değişen menü
- Profil sayfası

## Kurulum

1. Repoyu klonla
```bash
   git clone https://github.com/merd00/library-ui.git
   cd library-ui
```

2. Paketleri kur
```bash
   npm install
```

3. `lib/api.ts` dosyasında backend URL'ini güncelle
```typescript
   baseURL: "http://localhost:5024/api"
```

4. Uygulamayı başlat
```bash
   npm run dev
```

## Backend

[LibraryAPI](https://github.com/merd00/LibraryAPI) — ASP.NET Core ile geliştirilmiş backend