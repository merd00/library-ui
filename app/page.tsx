import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          📚 LibraryAPI
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          Kütüphanenizi kolayca yönetin
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/books"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Kitaplara Göz At
          </Link>
          <Link
            href="/register"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Hesap Oluştur
          </Link>
        </div>
      </div>

      {/* Özellikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitap Yönetimi</h3>
          <p className="text-gray-500 text-sm">Kitapları ekle, düzenle, sil ve ara</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Yazar Takibi</h3>
          <p className="text-gray-500 text-sm">Yazarları ve eserlerini takip et</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori Sistemi</h3>
          <p className="text-gray-500 text-sm">Kitapları kategorilere göre düzenle</p>
        </div>
      </div>
    </div>
  );
}