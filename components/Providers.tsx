"use client"; // Bu bileşen tarayıcıda çalışır — useState kullandığı için

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// QueryClient — React Query'nin merkezi veri deposu
// Cache, invalidation, refetch — hepsini yönetir
// useState içinde oluşturuyoruz — her render'da yeni instance olmasın

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Kaç ms sonra stale (bayat) sayılsın?
            // Stale olan veri arka planda yeniden çekilir
            staleTime: 1000 * 60, // 1 dakika
            // Hata olunca kaç kez tekrar dene?
            retry: 1,
          },
        },
      })
  );

  return (
    // QueryClientProvider → tüm alt bileşenlerin React Query kullanmasını sağlar
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}