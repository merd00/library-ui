"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookApi, authorApi, categoryApi } from "@/lib/api";
import { Book } from "@/lib/types";
import Link from "next/link";

export default function BooksPage() {
  // Sayfalama state'leri
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize]                  = useState(10);

  // Arama state'leri
  const [searchTitle,      setSearchTitle]      = useState("");
  const [selectedAuthor,   setSelectedAuthor]   = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [isSearching,      setIsSearching]      = useState(false);

  // useQuery — API'den kitapları çek
  // queryKey → cache anahtarı. pageNumber değişince otomatik yeniden çeker.
  // queryFn → veriyi nasıl çekeceğini söyler
  const { data: pagedBooks, isLoading, isError } = useQuery({
    queryKey: ["books", pageNumber, pageSize],
    queryFn:  () => bookApi.getAll(pageNumber, pageSize),
    enabled:  !isSearching, // Arama modunda değilse çalış
  });

  // Arama sonuçları
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["books", "search", searchTitle, selectedAuthor, selectedCategory],
    queryFn:  () => bookApi.search(searchTitle, selectedAuthor, selectedCategory),
    enabled:  isSearching, // Sadece arama modunda çalış
  });

  // Yazarlar ve kategoriler — dropdown için
  const { data: authors }     = useQuery({
    queryKey: ["authors"],
    queryFn:  authorApi.getAll,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn:  categoryApi.getAll,
  });

  // Hangi kitapları gösteriyoruz?
  const books: Book[] = isSearching
    ? (searchResults ?? [])
    : (pagedBooks?.items ?? []);

  const handleSearch = () => {
    setIsSearching(true);
    setPageNumber(1);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchTitle("");
    setSelectedAuthor(undefined);
    setSelectedCategory(undefined);
  };

  if (isLoading && !isSearching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Kitaplar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Bir hata oluştu</p>
          <p className="text-sm mt-2">Lütfen giriş yaptığınızdan emin olun.</p>
          <Link href="/login" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Başlık */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitaplar</h1>
          <p className="text-gray-500 mt-1">
            {isSearching
              ? `${books.length} sonuç bulundu`
              : `Toplam ${pagedBooks?.totalCount ?? 0} kitap`}
          </p>
        </div>
      </div>

      {/* Arama & Filtre */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Kitap adı arama */}
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Kitap adı ara..."
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Yazar filtresi */}
          <select
            value={selectedAuthor ?? ""}
            onChange={(e) => setSelectedAuthor(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Tüm Yazarlar</option>
            {authors?.map((author) => (
              <option key={author.id} value={author.id}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>

          {/* Kategori filtresi */}
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Tüm Kategoriler</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Butonlar */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {isSearchLoading ? "Aranıyor..." : "Ara"}
            </button>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Kitap Listesi */}
      {books.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-xl font-medium">Kitap bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {!isSearching && pagedBooks && pagedBooks.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPageNumber((p) => p - 1)}
            disabled={!pagedBooks.hasPreviousPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Önceki
          </button>

          <span className="text-gray-600 text-sm">
            Sayfa {pagedBooks.pageNumber} / {pagedBooks.totalPages}
          </span>

          <button
            onClick={() => setPageNumber((p) => p + 1)}
            disabled={!pagedBooks.hasNextPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

// Kitap kartı bileşeni — ayrı component olarak tanımladık
// Tek sorumluluk prensibi — sadece bir kitabı gösterir
function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">

        {/* Kitap başlığı */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
          {book.title}
        </h3>

        {/* Yazar */}
        <p className="text-indigo-600 font-medium text-sm mb-3">
          ✍️ {book.authorName}
        </p>

        {/* Detaylar */}
        <div className="space-y-1 text-sm text-gray-500">
          <p>📂 {book.categoryName}</p>
          <p>📄 {book.pageCount} sayfa</p>
          <p>📅 {book.publishedYear}</p>
          <p className="font-mono text-xs mt-2 text-gray-400">ISBN: {book.isbn}</p>
        </div>
      </div>
    </Link>
  );
}