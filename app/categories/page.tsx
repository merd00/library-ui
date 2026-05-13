"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn:  categoryApi.getAll,
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
        <p className="text-red-500 font-semibold">Bir hata oluştu</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
        <p className="text-gray-500 mt-1">Toplam {categories?.length ?? 0} kategori</p>
      </div>

      {categories?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📂</p>
          <p className="text-xl font-medium">Henüz kategori eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                📂 {category.name}
              </h3>

              <p className="text-indigo-600 text-sm font-medium mb-3">
                {category.bookCount} kitap
              </p>

              {category.description && (
                <p className="text-gray-500 text-sm">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}