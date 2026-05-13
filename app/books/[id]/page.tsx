"use client";

import { useQuery } from "@tanstack/react-query";
import { bookApi } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BookDetailPage() {
  const params = useParams();
  const id     = Number(params.id);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn:  () => bookApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">Kitap bulunamadı</p>
          <Link href="/books" className="mt-4 inline-block text-indigo-600 hover:underline">
            ← Kitaplara dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <Link href="/books" className="text-indigo-600 hover:underline text-sm mb-6 inline-block">
        ← Kitaplara dön
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>

        {/* Yazar — yazarlar sayfasına link */}
        <Link
          href="/authors"
          className="text-indigo-600 font-semibold text-lg mb-6 hover:underline inline-block"
        >
          ✍️ {book.authorName}
        </Link>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Kategori</p>
            <p className="text-gray-900 font-medium">📂 {book.categoryName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sayfa Sayısı</p>
            <p className="text-gray-900 font-medium">📄 {book.pageCount} sayfa</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Yayın Yılı</p>
            <p className="text-gray-900 font-medium">📅 {book.publishedYear}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">ISBN</p>
            <p className="text-gray-900 font-mono text-sm">{book.isbn}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Eklenme: {new Date(book.createdAt).toLocaleDateString("tr-TR")}
        </p>
      </div>
    </div>
  );
}