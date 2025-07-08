// =============================================
// Blog Service (Client) - 클라이언트용 Supabase 연동 함수들
// =============================================

import { supabase } from './supabase-client';
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
// Posts 관련 함수들 (클라이언트용)
// =============================================

/**
 * 모든 글 목록 조회 (관리자용 - 클라이언트)
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
 * ID로 글 조회 (클라이언트용)
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
 * 글 생성 (클라이언트용)
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
 * 글 수정 (클라이언트용)
 */
export async function updatePost(postData: UpdatePostData): Promise<Post> {
  const { id, ...updateData } = postData;
  
  const { data: post, error } = await supabase
    .from('posts')
    .update(updateData)
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
 * 글 삭제 (클라이언트용)
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
 * 글 검색 (클라이언트용)
 */
export async function searchPosts(options: PostSearchOptions): Promise<Post[]> {
  const { query: searchQuery, limit = 10, includeUnpublished = false } = options;

  let query = supabase
    .from('posts')
    .select('*');

  // 공개된 글만 검색 (관리자가 아닌 경우)
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }

  // 제목이나 내용에서 검색
  query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

  // 정렬 및 제한
  query = query
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error searching posts:', error);
    throw new Error('게시글 검색에 실패했습니다.');
  }

  return posts || [];
}

// =============================================
// Categories 관련 함수들 (클라이언트용)
// =============================================

/**
 * 모든 카테고리 조회 (클라이언트용)
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
 * 카테고리 생성 (클라이언트용)
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
 * 카테고리 수정 (클라이언트용)
 */
export async function updateCategory(categoryData: UpdateCategoryData): Promise<Category> {
  const { id, ...updateData } = categoryData;
  
  const { data: category, error } = await supabase
    .from('categories')
    .update(updateData)
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
 * 카테고리 삭제 (클라이언트용)
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
// 통계 관련 함수들 (클라이언트용)
// =============================================

/**
 * 블로그 통계 조회 (클라이언트용)
 */
export async function getBlogStats(): Promise<BlogStats> {
  try {
    // 전체 글 수
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    // 공개된 글 수
    const { count: publishedPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    // 초안 수
    const { count: draftPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', false);

    // 전체 조회수
    const { data: viewData } = await supabase
      .from('posts')
      .select('view_count');

    const totalViews = viewData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    return {
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      draftPosts: draftPosts || 0,
      totalViews
    };
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    throw new Error('블로그 통계를 불러오는데 실패했습니다.');
  }
}

/**
 * 카테고리별 통계 조회 (클라이언트용)
 */
export async function getCategoryStats(): Promise<CategoryStats[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('category')
      .eq('published', true);

    if (error) throw error;

    // 카테고리별 글 개수 계산
    const categoryCount: Record<string, number> = {};
    posts?.forEach(post => {
      if (post.category) {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
      }
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count
    }));
  } catch (error) {
    console.error('Error fetching category stats:', error);
    throw new Error('카테고리 통계를 불러오는데 실패했습니다.');
  }
}

// =============================================
// 유틸리티 함수들
// =============================================

/**
 * 슬러그 생성
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .trim();
}

/**
 * 슬러그 중복 확인 (클라이언트용)
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