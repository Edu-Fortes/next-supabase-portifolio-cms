import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Tables } from '@/types/supabase';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function PortfolioPage() {
  const supabase = await createClient();

  // 1. Check for user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // 2. Fetch data
  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Manage Portfolio</h2>
        {/* 3. Add "Create New" button */}
        <Button asChild>
          <Link href='/dashboard/portfolio/new-project'>
            Create New Project
          </Link>
        </Button>
      </div>

      {/* 4. Display data in a Table */}
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of your portfolio projects.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project: Tables<'portfolio_projects'>) => (
                  <TableRow key={project.id}>
                    <TableCell className='font-medium'>
                      {project.title}
                    </TableCell>
                    <TableCell>
                      {project.description?.substring(0, 50)}...
                    </TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString(
                        'pt-BR',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(project.updated_at).toLocaleDateString(
                        'pt-BR',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {/* We will add DropdownMenu for Edit/Delete here */}
                      <span>...</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
