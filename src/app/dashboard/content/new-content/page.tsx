import { ContentForm } from '../content-form';

export default function NewContentPage() {
  return (
    <div>
      <h2 className='font-semibold'>Create New Content</h2>
      <p className='text-sm text-muted-foreground'>
        Fill out the details for your new portfolio project or blog post.
      </p>
      <ContentForm action='create' />
    </div>
  );
}
