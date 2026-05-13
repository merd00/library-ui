"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/auth";

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname(); // Aktif URL'i dinler
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState("");
  const [admin,      setAdmin]      = useState(false);

  // pathname değişince — yani her sayfa geçişinde — yeniden kontrol et
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).firstName);
      setAdmin(isAdmin());
    } else {
      setIsLoggedIn(false);
      setAdmin(false);
    }
  }, [pathname]); // pathname dependency'si — her route değişiminde çalışır

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setAdmin(false);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="text-xl font-bold text-indigo-600">
            📚 LibraryAPI
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/books" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Kitaplar
            </Link>
            <Link href="/authors" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Yazarlar
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Kategoriler
            </Link>
            {admin && (
              <Link href="/admin" className="text-purple-600 hover:text-purple-800 transition-colors font-medium flex items-center gap-1">
                ⚙️ Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="text-gray-600 text-sm hover:text-indigo-600 transition-colors">
                  Hoş geldin, <strong>{userName}</strong>
                  {admin && (
                    <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm">
                  Giriş
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}