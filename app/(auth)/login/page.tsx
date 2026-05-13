"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // Form state'leri — her input'un değeri burada tutulur
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // UI state'leri — yükleniyor mu, hata var mı?
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    // Formun varsayılan davranışını engelle — sayfa yenilenmesin
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API'ye giriş isteği at
      const response = await authApi.login({ email, password });

      // Token ve kullanıcı bilgisini localStorage'a kaydet
      // localStorage → tarayıcıda kalıcı depolama
      // Sayfa kapanıp açılsa bile silinmez
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({
        email:     response.email,
        firstName: response.firstName,
        lastName:  response.lastName,
      }));

      // Başarılı — kitap listesine yönlendir
      router.push("/books");

    } catch (err: any) {
      // Hata mesajını göster
      setError(
        err.response?.data?.detail || "Giriş başarısız. Bilgilerinizi kontrol edin."
      );
    } finally {
      // İstek bitti — loading'i kapat
      // Finally → hata olsa da olmasa da çalışır — C#'taki gibi
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Başlık */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">📚 LibraryAPI</h1>
          <p className="mt-2 text-gray-600">Hesabına giriş yap</p>
        </div>

        {/* Form kartı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* Hata mesajı */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                // onChange → her tuş basışında state güncelle
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="ornek@email.com"
              />
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••"
              />
            </div>

            {/* Submit butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

          </form>

          {/* Kayıt linki */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Kayıt ol
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}