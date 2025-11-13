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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function PortfolioPage() {
  const supabase = await createClient();

  // 1. Fetch only content marked as 'PROJECT'
  const { data: projects, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', 'PROJECT')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className='container mx-auto max-w-5xl p-4'>
      <h1 className='text-4xl font-bold mb-8'>My Portfolio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {projects && projects.length > 0 ? (
          projects.map((project: Tables<'content'>) => (
            <Card key={project.id} className='flex flex-col'>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardFooter className='mt-auto flex justify-between'>
                {/* 2. Link to the (future) detail page */}
                <Button asChild variant='outline'>
                  <Link href={`/portfolio/${project.slug}`}>
                    View Case Study
                  </Link>
                </Button>

                {/* You can add live/github links here too */}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No projects found. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
