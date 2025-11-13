import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import the RSC version
import Link from 'next/link';

// 1. Import custom component
import { Carousel } from '@/components/mdx/carousel';
import { Button } from '@/components/ui/button';

// 2. Define the list of components MDX can use
const components = {
  Carousel, // When MDX sees <Carousel />, it will use custom component
  // Add more here later, like:
  // img: (props) => <Image alt={props.alt} {...props} />,
  // h2: (props) => <h2 className="text-2xl font-bold" {...props} />,
};

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 4. Main page component
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 5. Fetch the single project by its slug
  const { data: project, error } = await supabase
    .from('content')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'PROJECT') // Ensure it's a project
    .single();

  // 6. If no project, show a 404
  if (error || !project) {
    notFound();
  }

  return (
    <article className='container mx-auto max-w-3xl p-4 py-8'>
      {/* Page Header */}
      <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
        {project.title}
      </h1>
      <p className='text-xl text-muted-foreground mb-6'>
        {project.description}
      </p>

      {/* GitHub / Live Links */}
      <div className='flex gap-4 mb-8'>
        {project.live_url && (
          <Button asChild>
            <Link
              href={project.live_url}
              target='_blank'
              rel='noopener noreferrer'
            >
              View Live Site
            </Link>
          </Button>
        )}
        {project.github_url && (
          <Button asChild variant='secondary'>
            <Link
              href={project.github_url}
              target='_blank'
              rel='noopener noreferrer'
            >
              View on GitHub
            </Link>
          </Button>
        )}
      </div>

      {/* The MDX Content */}
      <div className='prose dark:prose-invert max-w-none'>
        {/* 7. This is where the magic happens! */}
        <MDXRemote source={project.body || ''} components={components} />
      </div>
    </article>
  );
}
