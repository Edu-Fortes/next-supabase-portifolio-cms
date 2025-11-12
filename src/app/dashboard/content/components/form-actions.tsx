'use client';

import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isPending: boolean;
  onCancel: () => void;
}

export function FormActions({ isPending, onCancel }: FormActionsProps) {
  return (
    <div className='flex justify-end gap-2'>
      <Button type='button' variant='outline' onClick={onCancel}>
        Cancel
      </Button>
      <Button type='submit' disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Content'}
      </Button>
    </div>
  );
}
