import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

// Re-use the same component list from the portfolio
import { MDXCarousel } from '@/components/mdx/carousel';

// Define the list of components MDX can use
const components = {
  MDXCarousel,
  // Add any other custom components to use in blog posts
};

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch the single article by its slug
  const { data: article, error } = await supabase
    .from('content')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'ARTICLE') // Ensure it's an article
    .single();

  // 2. If no article, show a 404
  if (error || !article) {
    notFound();
  }

  return (
    <article className='container mx-auto max-w-3xl p-4 py-8'>
      {/* Page Header */}
      <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
        {article.title}
      </h1>
      <p className='text-xl text-muted-foreground mb-4'>
        {article.description}
      </p>
      <span className='text-sm text-muted-foreground'>
        Posted on {new Date(article.created_at).toLocaleDateString()}
      </span>

      <hr className='my-8' />

      {/* The MDX Content */}
      <div className='prose dark:prose-invert max-w-none'>
        {/* 3. This renders the Markdown/MDX */}
        <MDXRemote source={article.body || ''} components={components} />
      </div>
    </article>
  );
}
