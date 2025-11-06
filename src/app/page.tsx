import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types';

export default async function Home() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) console.error('Error fetching data:', error);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>My Portfolio</h1>

      <div className='w-full max-w-2xl'>
        <h2 className='text-2xl font-semibold mb-4'>
          Projects (from Server!):
        </h2>
        {projects && projects.length > 0 ? (
          <ul>
            {projects.map((project: Project) => (
              <li key={project.id} className='border p-4 rounded-md mb-2'>
                <h3 className='text-lg font-bold'>{project.title}</h3>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found. (Go to the admin panel to add some!)</p>
        )}
      </div>
    </main>
  );
}
