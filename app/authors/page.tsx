"use client";

import { useQuery } from "@tanstack/react-query";
import { authorApi } from "@/lib/api";
import Link from "next/link";

export default function AuthorsPage() {
  const { data: authors, isLoading, isError } = useQuery({
    queryKey: ["authors"],
    queryFn:  authorApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">Bir hata oluştu</p>
          <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">
            Giriş yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yazarlar</h1>
        <p className="text-gray-500 mt-1">Toplam {authors?.length ?? 0} yazar</p>
      </div>

      {authors?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">✍️</p>
          <p className="text-xl font-medium">Henüz yazar eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors?.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              {/* Yazar adı */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {author.firstName} {author.lastName}
              </h3>

              {/* Kitap sayısı */}
              <p className="text-indigo-600 text-sm font-medium mb-3">
                📚 {author.bookCount} kitap
              </p>

              {/* Biyografi */}
              {author.biography && (
                <p className="text-gray-500 text-sm line-clamp-3">
                  {author.biography}
                </p>
              )}

              {/* Eklenme tarihi */}
              <p className="text-xs text-gray-400 mt-4">
                {new Date(author.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}