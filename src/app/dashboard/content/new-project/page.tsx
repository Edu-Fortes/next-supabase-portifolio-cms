import { PortfolioProjectForm } from '../portfolio-project-form';

export default function NewPortfolioProjectPage() {
  return (
    <div>
      <h2 className='font-semibold'>Create New Project</h2>
      <p className='text-sm text-muted-foreground'>
        Fill out the details for your portfolio project.
      </p>
      <PortfolioProjectForm action='create' className='mt-6' />
    </div>
  );
}
