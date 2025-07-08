import { getAllPosts } from '@/lib/blog-service';

const URL = 'https://seonghyeonblog.vercel.app';

export default async function sitemap() {
  const posts = await getAllPosts({ limit: 1000 }).then(res => res.posts);

  const postsUrls = posts.map((post) => ({
    url: `${URL}/articles/${post.slug}`,
    lastModified: new Date(post.updated_at).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${URL}/articles`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
    },
    {
        url: `${URL}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
    }
  ];

  return [...staticUrls, ...postsUrls];
} 