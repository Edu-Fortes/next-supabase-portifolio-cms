import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function BlogPage() {
  const supabase = await createClient();

  // 1. Fetch only content marked as 'ARTICLE'
  const { data: articles, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', 'ARTICLE')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <h1 className='text-4xl font-bold mb-8'>My Blog</h1>

      <div className='space-y-6'>
        {articles && articles.length > 0 ? (
          articles.map((article: Tables<'content'>) => (
            <Card key={article.id} className='flex flex-col'>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardFooter className='flex justify-between items-center'>
                <Button asChild variant='outline'>
                  {/* 2. Link to the (future) detail page */}
                  <Link href={`/blog/${article.slug}`}>Read More</Link>
                </Button>
                <span className='text-sm text-muted-foreground'>
                  {new Date(article.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No articles found. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
