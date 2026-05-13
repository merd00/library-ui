import axios from "axios";
import { AuthResponse, LoginDto, RegisterDto, PagedResult, Book, Author, Category, CreateBookDto, CreateAuthorDto, CreateCategoryDto, User } from "./types";

// Axios instance — merkezi HTTP istemcisi
// Tüm API istekleri buradan geçer
// baseURL → her istekte başa otomatik eklenir
const api = axios.create({
  baseURL: "http://localhost:5024/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor — istek gitmeden önce çalışır
// Her isteğe otomatik JWT token ekler
// Kullanıcı giriş yapmışsa localStorage'dan token alır
api.interceptors.request.use((config) => {
  // localStorage → tarayıcının kalıcı depolama alanı
  // Sayfa yenilenince de kaybolmaz — cookie'ye benzer ama daha basit
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor — yanıt gelince çalışır
// 401 → token geçersiz veya süresi dolmuş
// Kullanıcıyı login sayfasına yönlendir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -------------------------
// AUTH SERVİSLERİ
// -------------------------

export const authApi = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", dto);
    return response.data;
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", dto);
    return response.data;
  },
};

// -------------------------
// KİTAP SERVİSLERİ
// -------------------------

export const bookApi = {
  getAll: async (pageNumber = 1, pageSize = 10): Promise<PagedResult<Book>> => {
    const response = await api.get<PagedResult<Book>>(
      `/books?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  search: async (title?: string, authorId?: number, categoryId?: number): Promise<Book[]> => {
    const params = new URLSearchParams();
    if (title)      params.append("title",      title);
    if (authorId)   params.append("authorId",   authorId.toString());
    if (categoryId) params.append("categoryId", categoryId.toString());
    const response = await api.get<Book[]>(`/books/search?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  create: async (dto: CreateBookDto): Promise<Book> => {
    const response = await api.post<Book>("/books", dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
  
  update: async (id: number, dto: Partial<CreateBookDto>): Promise<void> => {
    await api.put(`/books/${id}`, dto);
  },
};

// -------------------------
// YAZAR SERVİSLERİ
// -------------------------

export const authorApi = {
  getAll: async (): Promise<Author[]> => {
    const response = await api.get<Author[]>("/authors");
    return response.data;
  },

  getById: async (id: number): Promise<Author> => {
    const response = await api.get<Author>(`/authors/${id}`);
    return response.data;
  },

  create: async (dto: CreateAuthorDto): Promise<Author> => {
    const response = await api.post<Author>("/authors", dto);
    return response.data;
  },
  // authorApi içine ekle
  update: async (id: number, dto: Partial<CreateAuthorDto>): Promise<void> => {
    await api.put(`/authors/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/authors/${id}`);
  },
};

// -------------------------
// KATEGORİ SERVİSLERİ
// -------------------------

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  create: async (dto: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>("/categories", dto);
    return response.data;
  },
  // categoryApi içine ekle
  update: async (id: number, dto: Partial<CreateCategoryDto>): Promise<void> => {
    await api.put(`/categories/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default api;

// Hata mesajını akıllıca çözen yardımcı fonksiyon
// Backend'den gelen farklı hata formatlarını tek tip stringe çevirir
export function getErrorMessage(err: any): string {
  // Global exception handler formatı — ProblemDetails
  if (err.response?.data?.detail) {
    return err.response.data.detail;
  }

  // ASP.NET Core validation hatası formatı
  // { errors: { Title: ["Zorunlu"], Price: ["0'dan büyük olmalı"] } }
  if (err.response?.data?.errors) {
    const errors = err.response.data.errors;
    const messages = Object.values(errors)
      .flat()
      .join(", ");
    return messages;
  }

  // Genel mesaj
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // HTTP status'a göre Türkçe mesaj
  switch (err.response?.status) {
    case 400: return "Geçersiz istek — lütfen tüm alanları doğru doldurun.";
    case 401: return "Oturum süreniz dolmuş — lütfen tekrar giriş yapın.";
    case 403: return "Bu işlem için yetkiniz yok.";
    case 404: return "Kayıt bulunamadı.";
    case 409: return "Bu kayıt zaten mevcut.";
    case 500: return "Sunucu hatası — lütfen daha sonra tekrar deneyin.";
    default:  return "Beklenmeyen bir hata oluştu.";
  }
}

// -------------------------
// KULLANICI YÖNETİMİ
// -------------------------
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  makeAdmin: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/make-admin`);
  },

  removeAdmin: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/remove-admin`);
  },
};