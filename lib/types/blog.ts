// =============================================
// Blog Database Types
// Supabase 데이터베이스 스키마와 일치하는 타입 정의
// =============================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[] | null;
  featured_image: string | null;
  meta_description: string | null;
  published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

// 글 작성/수정을 위한 타입 (필수 필드만)
export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  meta_description?: string;
  published?: boolean;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

// 카테고리 생성/수정을 위한 타입
export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

// 블로그 글 목록 조회 옵션
export interface PostListOptions {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  published?: boolean;
  sortBy?: 'created_at' | 'updated_at' | 'view_count' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// 글 검색 옵션
export interface PostSearchOptions {
  query: string;
  category?: string;
  tags?: string[];
  limit?: number;
}

// API 응답 타입
export interface PostsResponse {
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

export interface CategoriesResponse {
  categories: Category[];
}

// 통계 데이터 타입
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  categoriesCount: number;
}

export interface CategoryStats {
  category_name: string;
  post_count: number;
}

// 글 상태 enum
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

// 정렬 옵션 enum
export enum SortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_VIEWED = 'most_viewed',
  ALPHABETICAL = 'alphabetical'
} 