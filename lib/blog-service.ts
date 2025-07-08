// =============================================
// Blog Service - Supabase 데이터베이스 연동 함수들
// =============================================

import { supabase } from './supabase-admin';
import type {
  Post,
  Category,
  CreatePostData,
  UpdatePostData,
  CreateCategoryData,
  UpdateCategoryData,
  PostListOptions,
  PostSearchOptions,
  PostsResponse,
  CategoriesResponse,
  BlogStats,
  CategoryStats
} from './types/blog';

// =============================================
// Posts 관련 함수들
// =============================================

/**
 * 게시된 글 목록 조회 (공개용)
 */
export async function getPublishedPosts(options: PostListOptions = {}): Promise<PostsResponse> {
  const {
    category,
    tag,
    limit = 10,
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true);

  // 카테고리 필터
  if (category) {
    query = query.eq('category', category);
  }

  // 태그 필터
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // 정렬
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // 페이지네이션
  query = query.range(offset, offset + limit - 1);

  const { data: posts, error, count } = await query;

  if (error) {
    console.error('Error fetching published posts:', error);
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return {
    posts: posts || [],
    totalCount: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

/**
 * 모든 글 목록 조회 (관리자용)
 */
export async function getAllPosts(options: PostListOptions = {}): Promise<PostsResponse> {
  const {
    category,
    tag,
    limit = 10,
    offset = 0,
    published,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' });

  // 게시 상태 필터 (관리자는 선택적으로 필터 가능)
  if (published !== undefined) {
    query = query.eq('published', published);
  }

  // 카테고리 필터
  if (category) {
    query = query.eq('category', category);
  }

  // 태그 필터
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // 정렬
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // 페이지네이션
  query = query.range(offset, offset + limit - 1);

  const { data: posts, error, count } = await query;

  if (error) {
    console.error('Error fetching all posts:', error);
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return {
    posts: posts || [],
    totalCount: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

/**
 * 최근 게시글 조회
 */
export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error('최근 게시글을 불러오는데 실패했습니다.');
  }

  return posts || [];
}

/**
 * 슬러그로 글 조회
 */
export async function getPostBySlug(slug: string, includeUnpublished: boolean = false): Promise<Post | null> {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  // 공개된 글만 조회 (관리자가 아닌 경우)
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }

  const { data: post, error } = await query;

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // 글을 찾을 수 없음
    }
    console.error('Error fetching post by slug:', error);
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return post;
}

/**
 * ID로 글 조회
 */
export async function getPostById(id: string): Promise<Post | null> {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching post by ID:', error);
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return post;
}

/**
 * 글 생성
 */
export async function createPost(postData: CreatePostData): Promise<Post> {
  const { data: post, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('게시글 생성에 실패했습니다.');
  }

  return post;
}

/**
 * 글 수정
 */
export async function updatePost(postData: UpdatePostData): Promise<Post> {
  const { id, ...updates } = postData;

  const { data: post, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw new Error('게시글 수정에 실패했습니다.');
  }

  return post;
}

/**
 * 글 삭제
 */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('게시글 삭제에 실패했습니다.');
  }
}

/**
 * 조회수 증가
 */
export async function incrementViewCount(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { post_id: id });

  if (error) {
    console.error('Error incrementing view count:', error);
    // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}

/**
 * 글 검색
 */
export async function searchPosts(options: PostSearchOptions): Promise<Post[]> {
  const { query, category, tags, limit = 10 } = options;

  let dbQuery = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) {
    dbQuery = dbQuery.eq('category', category);
  }

  if (tags && tags.length > 0) {
    dbQuery = dbQuery.overlaps('tags', tags);
  }

  const { data: posts, error } = await dbQuery;

  if (error) {
    console.error('Error searching posts:', error);
    throw new Error('게시글 검색에 실패했습니다.');
  }

  return posts || [];
}

// =============================================
// Categories 관련 함수들
// =============================================

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('카테고리를 불러오는데 실패했습니다.');
  }

  return categories || [];
}

/**
 * 카테고리 생성
 */
export async function createCategory(categoryData: CreateCategoryData): Promise<Category> {
  const { data: category, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error('카테고리 생성에 실패했습니다.');
  }

  return category;
}

/**
 * 카테고리 수정
 */
export async function updateCategory(categoryData: UpdateCategoryData): Promise<Category> {
  const { id, ...updates } = categoryData;

  const { data: category, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error('카테고리 수정에 실패했습니다.');
  }

  return category;
}

/**
 * 카테고리 삭제
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error('카테고리 삭제에 실패했습니다.');
  }
}

// =============================================
// 통계 관련 함수들
// =============================================

/**
 * 블로그 통계 조회
 */
export async function getBlogStats(): Promise<BlogStats> {
  const [
    { count: totalPosts },
    { count: publishedPosts },
    { data: totalViewsData },
    { count: categoriesCount }
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('posts').select('view_count').eq('published', true),
    supabase.from('categories').select('*', { count: 'exact', head: true })
  ]);

  const totalViews = totalViewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    totalViews,
    categoriesCount: categoriesCount || 0
  };
}

/**
 * 카테고리별 게시글 수 조회
 */
export async function getCategoryStats(): Promise<CategoryStats[]> {
  const { data, error } = await supabase.rpc('get_posts_by_category');

  if (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }

  return data || [];
}

// =============================================
// 유틸리티 함수들
// =============================================

/**
 * 슬러그 생성 유틸리티
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속된 하이픈 제거
    .trim();
}

/**
 * 슬러그 중복 확인
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('posts')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }

  return !data || data.length === 0;
} 