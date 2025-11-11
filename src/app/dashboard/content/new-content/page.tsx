import { ContentForm } from '../content-form';

export default function NewContentPage() {
  return (
    <div>
      <h2 className='font-semibold'>Create New Project</h2>
      <p className='text-sm text-muted-foreground'>
        Fill out the details for your portfolio project.
      </p>
      <ContentForm action='create' />
    </div>
  );
}
