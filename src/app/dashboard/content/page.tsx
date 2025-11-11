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
import { Badge } from '@/components/ui/badge'; // We'll add this

export default async function ContentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Fetch from 'content' table
  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content:', error);
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Manage Content</h2>
        <Button asChild>
          <Link href='/dashboard/content/new'>Create New Content</Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of your projects and articles.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content && content.length > 0 ? (
                content.map((item: Tables<'content'>) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.title}</TableCell>

                    {/* Display the type as a Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          item.content_type === 'PROJECT'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {item.content_type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(item.updated_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className='text-right'>
                      <span>...</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    No content found.
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
