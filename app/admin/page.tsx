"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { bookApi, authorApi, categoryApi, userApi, getErrorMessage } from "@/lib/api";
import { Book, Author, Category } from "@/lib/types";

export default function AdminPage() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  const [activeTab,   setActiveTab]   = useState<"books" | "authors" | "categories" | "users">("books");
  const [message,     setMessage]     = useState({ text: "", type: "" });

  // Kitap state'leri
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm,    setBookForm]    = useState({ title: "", isbn: "", pageCount: 0, publishedYear: 0, authorId: 0, categoryId: 0 });
  const [editBookForm, setEditBookForm] = useState({ title: "", isbn: "", pageCount: 0, publishedYear: 0, authorId: 0, categoryId: 0 });

  // Yazar state'leri
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [authorForm,    setAuthorForm]    = useState({ firstName: "", lastName: "", biography: "" });
  const [editAuthorForm, setEditAuthorForm] = useState({ firstName: "", lastName: "", biography: "" });

  // Kategori state'leri
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm,    setCategoryForm]    = useState({ name: "", description: "" });
  const [editCategoryForm, setEditCategoryForm] = useState({ name: "", description: "" });

  // Kullanıcı state'leri
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Queries
  const { data: authors }    = useQuery({ queryKey: ["authors"],       queryFn: authorApi.getAll });
  const { data: categories } = useQuery({ queryKey: ["categories"],    queryFn: categoryApi.getAll });
  const { data: books }      = useQuery({ queryKey: ["books", 1, 100], queryFn: () => bookApi.getAll(1, 100) });
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ["users"], queryFn: userApi.getAll });

  const filteredUsers = users?.filter((u) =>
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Kitap mutation'ları
  const createBookMutation = useMutation({
    mutationFn: bookApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setMessage({ text: "✅ Kitap eklendi!", type: "success" });
      setBookForm({ title: "", isbn: "", pageCount: 0, publishedYear: 0, authorId: 0, categoryId: 0 });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => bookApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setMessage({ text: "✅ Kitap güncellendi!", type: "success" });
      setEditingBook(null);
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const deleteBookMutation = useMutation({
    mutationFn: bookApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setMessage({ text: "✅ Kitap silindi!", type: "success" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  // Yazar mutation'ları
  const createAuthorMutation = useMutation({
    mutationFn: authorApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setMessage({ text: "✅ Yazar eklendi!", type: "success" });
      setAuthorForm({ firstName: "", lastName: "", biography: "" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const updateAuthorMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => authorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setMessage({ text: "✅ Yazar güncellendi!", type: "success" });
      setEditingAuthor(null);
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: authorApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setMessage({ text: "✅ Yazar silindi!", type: "success" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  // Kategori mutation'ları
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setMessage({ text: "✅ Kategori eklendi!", type: "success" });
      setCategoryForm({ name: "", description: "" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setMessage({ text: "✅ Kategori güncellendi!", type: "success" });
      setEditingCategory(null);
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setMessage({ text: "✅ Kategori silindi!", type: "success" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  // Kullanıcı mutation'ları
  const makeAdminMutation = useMutation({
    mutationFn: userApi.makeAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setMessage({ text: "✅ Kullanıcı admin yapıldı!", type: "success" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  const removeAdminMutation = useMutation({
    mutationFn: userApi.removeAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setMessage({ text: "✅ Adminlik kaldırıldı!", type: "success" });
    },
    onError: (err: any) => setMessage({ text: getErrorMessage(err), type: "error" }),
  });

  // Edit handler'ları
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    const authorId   = authors?.find(a => `${a.firstName} ${a.lastName}` === book.authorName)?.id ?? 0;
    const categoryId = categories?.find(c => c.name === book.categoryName)?.id ?? 0;
    setEditBookForm({ title: book.title, isbn: book.isbn, pageCount: book.pageCount, publishedYear: book.publishedYear, authorId, categoryId });
    setMessage({ text: "", type: "" });
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setEditAuthorForm({ firstName: author.firstName, lastName: author.lastName, biography: author.biography ?? "" });
    setMessage({ text: "", type: "" });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryForm({ name: category.name, description: category.description ?? "" });
    setMessage({ text: "", type: "" });
  };

  const inputClass = "px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  const tabs = [
    { key: "books",      label: "📚 Kitaplar" },
    { key: "authors",    label: "✍️ Yazarlar" },
    { key: "categories", label: "📂 Kategoriler" },
    { key: "users",      label: "👥 Kullanıcılar" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Paneli</h1>
      <p className="text-gray-500 mb-6">Kitap, yazar, kategori ve kullanıcı yönetimi</p>

      {/* Mesaj */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex justify-between items-start ${
          message.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: "", type: "" })} className="ml-4 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      )}

      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.key}
            onClick={() => { setActiveTab(tab.key); setMessage({ text: "", type: "" }); setEditingBook(null); setEditingAuthor(null); setEditingCategory(null); }}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── KİTAPLAR ── */}
      {activeTab === "books" && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Kitap Ekle</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Kitap adı *" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} className={inputClass} />
              <input placeholder="ISBN *" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Sayfa sayısı *" value={bookForm.pageCount || ""} onChange={(e) => setBookForm({ ...bookForm, pageCount: Number(e.target.value) })} className={inputClass} min={1} max={9999} />
              <input type="number" placeholder="Yayın yılı *" value={bookForm.publishedYear || ""} onChange={(e) => setBookForm({ ...bookForm, publishedYear: Number(e.target.value) })} className={inputClass} min={1000} max={2100} />
              <select value={bookForm.authorId || ""} onChange={(e) => setBookForm({ ...bookForm, authorId: Number(e.target.value) })} className={inputClass}>
                <option value="">Yazar seç *</option>
                {authors?.map((a) => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
              </select>
              <select value={bookForm.categoryId || ""} onChange={(e) => setBookForm({ ...bookForm, categoryId: Number(e.target.value) })} className={inputClass}>
                <option value="">Kategori seç *</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={() => createBookMutation.mutate(bookForm)} disabled={createBookMutation.isPending}
              className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {createBookMutation.isPending ? "Ekleniyor..." : "Kitap Ekle"}
            </button>
          </div>

          {editingBook && (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-indigo-900">✏️ Düzenleniyor: {editingBook.title}</h2>
                <button onClick={() => setEditingBook(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Kitap adı" value={editBookForm.title} onChange={(e) => setEditBookForm({ ...editBookForm, title: e.target.value })} className={inputClass} />
                <input placeholder="ISBN" value={editBookForm.isbn} onChange={(e) => setEditBookForm({ ...editBookForm, isbn: e.target.value })} className={inputClass} />
                <input type="number" placeholder="Sayfa sayısı" value={editBookForm.pageCount || ""} onChange={(e) => setEditBookForm({ ...editBookForm, pageCount: Number(e.target.value) })} className={inputClass} min={1} max={9999} />
                <input type="number" placeholder="Yayın yılı" value={editBookForm.publishedYear || ""} onChange={(e) => setEditBookForm({ ...editBookForm, publishedYear: Number(e.target.value) })} className={inputClass} min={1000} max={2100} />
                <select value={editBookForm.authorId || ""} onChange={(e) => setEditBookForm({ ...editBookForm, authorId: Number(e.target.value) })} className={inputClass}>
                  <option value="">Yazar seç</option>
                  {authors?.map((a) => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                </select>
                <select value={editBookForm.categoryId || ""} onChange={(e) => setEditBookForm({ ...editBookForm, categoryId: Number(e.target.value) })} className={inputClass}>
                  <option value="">Kategori seç</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => updateBookMutation.mutate({ id: editingBook.id, data: editBookForm })} disabled={updateBookMutation.isPending}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {updateBookMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button onClick={() => setEditingBook(null)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">İptal</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mevcut Kitaplar <span className="text-sm font-normal text-gray-400">({books?.items.length ?? 0} adet)</span>
            </h2>
            <div className="space-y-2">
              {books?.items.map((book) => (
                <div key={book.id} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                  editingBook?.id === book.id ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"
                }`}>
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.authorName} · {book.categoryName} · {book.publishedYear}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditBook(book)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
                    <button onClick={() => { if (confirm(`"${book.title}" silinsin mi?`)) deleteBookMutation.mutate(book.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── YAZARLAR ── */}
      {activeTab === "authors" && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Yazar Ekle</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Ad *" value={authorForm.firstName} onChange={(e) => setAuthorForm({ ...authorForm, firstName: e.target.value })} className={inputClass} />
              <input placeholder="Soyad *" value={authorForm.lastName} onChange={(e) => setAuthorForm({ ...authorForm, lastName: e.target.value })} className={inputClass} />
              <textarea placeholder="Biyografi (opsiyonel)" value={authorForm.biography} onChange={(e) => setAuthorForm({ ...authorForm, biography: e.target.value })} className={`col-span-2 ${inputClass} resize-none h-24`} />
            </div>
            <button onClick={() => createAuthorMutation.mutate(authorForm)} disabled={createAuthorMutation.isPending}
              className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {createAuthorMutation.isPending ? "Ekleniyor..." : "Yazar Ekle"}
            </button>
          </div>

          {editingAuthor && (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-indigo-900">✏️ Düzenleniyor: {editingAuthor.firstName} {editingAuthor.lastName}</h2>
                <button onClick={() => setEditingAuthor(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Ad" value={editAuthorForm.firstName} onChange={(e) => setEditAuthorForm({ ...editAuthorForm, firstName: e.target.value })} className={inputClass} />
                <input placeholder="Soyad" value={editAuthorForm.lastName} onChange={(e) => setEditAuthorForm({ ...editAuthorForm, lastName: e.target.value })} className={inputClass} />
                <textarea placeholder="Biyografi" value={editAuthorForm.biography} onChange={(e) => setEditAuthorForm({ ...editAuthorForm, biography: e.target.value })} className={`col-span-2 ${inputClass} resize-none h-24`} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => updateAuthorMutation.mutate({ id: editingAuthor.id, data: editAuthorForm })} disabled={updateAuthorMutation.isPending}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {updateAuthorMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button onClick={() => setEditingAuthor(null)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">İptal</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mevcut Yazarlar <span className="text-sm font-normal text-gray-400">({authors?.length ?? 0} adet)</span>
            </h2>
            <div className="space-y-2">
              {authors?.map((author) => (
                <div key={author.id} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                  editingAuthor?.id === author.id ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"
                }`}>
                  <div>
                    <p className="font-medium text-gray-900">{author.firstName} {author.lastName}</p>
                    <p className="text-sm text-gray-500">{author.bookCount} kitap</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditAuthor(author)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
                    <button onClick={() => { if (confirm(`"${author.firstName} ${author.lastName}" silinsin mi? Bu yazara ait kitaplar da silinir.`)) deleteAuthorMutation.mutate(author.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── KATEGORİLER ── */}
      {activeTab === "categories" && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
            <div className="space-y-4">
              <input placeholder="Kategori adı *" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className={`w-full ${inputClass}`} />
              <textarea placeholder="Açıklama (opsiyonel)" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className={`w-full ${inputClass} resize-none h-24`} />
            </div>
            <button onClick={() => createCategoryMutation.mutate(categoryForm)} disabled={createCategoryMutation.isPending}
              className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {createCategoryMutation.isPending ? "Ekleniyor..." : "Kategori Ekle"}
            </button>
          </div>

          {editingCategory && (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-indigo-900">✏️ Düzenleniyor: {editingCategory.name}</h2>
                <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
              </div>
              <div className="space-y-4">
                <input placeholder="Kategori adı" value={editCategoryForm.name} onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })} className={`w-full ${inputClass}`} />
                <textarea placeholder="Açıklama" value={editCategoryForm.description} onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })} className={`w-full ${inputClass} resize-none h-24`} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => updateCategoryMutation.mutate({ id: editingCategory.id, data: editCategoryForm })} disabled={updateCategoryMutation.isPending}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {updateCategoryMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button onClick={() => setEditingCategory(null)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">İptal</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mevcut Kategoriler <span className="text-sm font-normal text-gray-400">({categories?.length ?? 0} adet)</span>
            </h2>
            <div className="space-y-2">
              {categories?.map((category) => (
                <div key={category.id} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                  editingCategory?.id === category.id ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"
                }`}>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.bookCount} kitap</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCategory(category)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
                    <button onClick={() => { if (confirm(`"${category.name}" silinsin mi? İçindeki kitaplar kategorisiz kalır.`)) deleteCategoryMutation.mutate(category.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── KULLANICILAR ── */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Kullanıcı Yönetimi</h2>
          <p className="text-gray-500 text-sm mb-4">Kullanıcılara admin yetkisi ver veya kaldır.</p>
          <input type="text" placeholder="Email ile ara..." value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)} className={`w-full ${inputClass} mb-6`} />
          {usersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers?.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">Kullanıcı bulunamadı.</p>
              )}
              {filteredUsers?.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-600"
                      }`}>{user.role}</span>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Kayıt: {new Date(user.createdAt).toLocaleDateString("tr-TR")}</p>
                  </div>
                  <div>
                    {user.role === "Admin" ? (
                      <button onClick={() => { if (confirm(`${user.firstName} ${user.lastName} adlı kullanıcının adminliği kaldırılsın mı?`)) removeAdminMutation.mutate(user.id); }}
                        disabled={removeAdminMutation.isPending}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50 border border-red-200 rounded-lg transition-colors disabled:opacity-50">
                        Adminliği Kaldır
                      </button>
                    ) : (
                      <button onClick={() => { if (confirm(`${user.firstName} ${user.lastName} adlı kullanıcı admin yapılsın mı?`)) makeAdminMutation.mutate(user.id); }}
                        disabled={makeAdminMutation.isPending}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium px-4 py-2 hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors disabled:opacity-50">
                        Admin Yap
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}