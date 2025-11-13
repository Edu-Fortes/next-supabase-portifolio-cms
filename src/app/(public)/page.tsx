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

// Helper function to render a project card
function ProjectCard({ project }: { project: Tables<'content'> }) {
  return (
    <Card key={project.id} className='flex flex-col'>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className='mt-auto'>
        <Button asChild variant='outline'>
          <Link href={`/portfolio/${project.slug}`}>View Case Study</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to render an article card
function ArticleCard({ article }: { article: Tables<'content'> }) {
  return (
    <Card key={article.id} className='flex flex-col'>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{article.description}</CardDescription>
      </CardHeader>
      <CardFooter className='flex justify-between items-center'>
        <Button asChild variant='outline'>
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
  );
}

// The main Homepage component
export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch latest projects
  const { data: projects } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', 'PROJECT')
    .order('created_at', { ascending: false })
    .limit(3); // Get the 3 most recent

  // 2. Fetch latest articles
  const { data: articles } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', 'ARTICLE')
    .order('created_at', { ascending: false })
    .limit(3); // Get the 3 most recent

  return (
    <div className='container mx-auto max-w-5xl p-4 py-8'>
      {/* Hero/Introduction Section */}
      <section className='text-center py-16 mb-12'>
        <h1 className='text-5xl font-extrabold tracking-tight mb-4'>
          Hello, I&apos;m Edu Fortes
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          I&apos;m a full-stack developer passionate about building modern web
          applications. Welcome to my personal site, where I showcase my
          projects and share my thoughts.
        </p>
      </section>

      {/* Recent Projects Section */}
      <section className='mb-16'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold'>Recent Projects</h2>
          <Button asChild variant='ghost'>
            <Link href='/portfolio'>View All →</Link>
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project as Tables<'content'>}
              />
            ))
          ) : (
            <p>No projects yet. Stay tuned!</p>
          )}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold'>Latest Articles</h2>
          <Button asChild variant='ghost'>
            <Link href='/blog'>View All →</Link>
          </Button>
        </div>
        <div className='space-y-6'>
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article as Tables<'content'>}
              />
            ))
          ) : (
            <p>No articles yet. Stay tuned!</p>
          )}
        </div>
      </section>
    </div>
  );
}
