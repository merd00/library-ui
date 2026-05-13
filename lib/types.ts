// Backend DTO'larına birebir karşılık gelen TypeScript tipleri
// TypeScript'te "interface" → C#'taki interface gibi — veri şeklini tanımlar
// Fark: TypeScript interface'leri sadece tip kontrolü için, runtime'da yok olur

export interface Book {
  id: number;
  title: string;
  isbn: string;
  pageCount: number;
  publishedYear: number;
  authorName: string;
  categoryName: string;
  createdAt: string;
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  biography?: string; // "?" → opsiyonel, undefined olabilir — C#'taki "?" gibi
  createdAt: string;
  bookCount: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  bookCount: number;
}

// Generic tip — T yerine Book, Author, Category gelebilir
// C#'taki PagedResultDto<T> ile birebir aynı mantık
export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  pageCount: number;
  publishedYear: number;
  authorId: number;
  categoryId: number;
}

export interface CreateAuthorDto {
  firstName: string;
  lastName: string;
  biography?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}