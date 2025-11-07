import { ThemeModeToggle } from '@/components/ui/theme-mode-toggle';
import { createClient } from '@/lib/supabase/server';
import { PortfolioProject } from '@/types';

export default async function Home() {
  const supabase = await createClient();

  const { data: portfolioProjects, error } = await supabase
    .from('portfolio_projects')
    .select('*');

  if (error) console.error('Error fetching data:', error);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>My Portfolio</h1>

      <div className='w-full max-w-2xl'>
        <h2 className='text-2xl font-semibold mb-4'>
          Projects (from Server!):
        </h2>
        {portfolioProjects && portfolioProjects.length > 0 ? (
          <ul>
            {portfolioProjects.map((project: PortfolioProject) => (
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
      <ThemeModeToggle />
    </main>
  );
}
