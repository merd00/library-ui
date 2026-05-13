"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin, getTokenPayload } from "@/lib/auth";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user,  setUser]  = useState<any>(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsed  = JSON.parse(userData);
    const payload = getTokenPayload(token);

    setUser({
      ...parsed,
      // Token'dan eklenme tarihini al
      expiresAt: payload?.exp
        ? new Date(payload.exp * 1000).toLocaleString("tr-TR")
        : "Bilinmiyor",
    });
    setAdmin(isAdmin());
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profilim</h1>

      {/* Kullanıcı kartı */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                admin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {admin ? "Admin" : "Kullanıcı"}
              </span>
            </div>
          </div>
        </div>

        {/* Bilgiler */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-400 text-lg">✉️</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-400 text-lg">🔑</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">Oturum Bitiş</p>
              <p className="text-gray-900 font-medium">{user.expiresAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-400 text-lg">🛡️</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">Rol</p>
              <p className="text-gray-900 font-medium">{admin ? "Admin" : "Kullanıcı"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin paneline link */}
      {admin && (
        <Link href="/admin"
          className="block w-full text-center bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors mb-4">
          ⚙️ Admin Paneline Git
        </Link>
      )}

      <Link href="/books"
        className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
        📚 Kitaplara Dön
      </Link>
    </div>
  );
}