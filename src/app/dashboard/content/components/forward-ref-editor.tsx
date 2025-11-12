'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor';

// This is the only place InitializedMDXEditor is imported directly.
// We use dynamic import with ssr: false to prevent server-side rendering
const Editor = dynamic(() => import('./mdx-editor'), {
  // Make sure we turn SSR off
  ssr: false,
  loading: () => (
    <div className='border rounded-md p-4 bg-muted/50'>
      <p className='text-sm text-muted-foreground'>Loading editor...</p>
    </div>
  ),
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
);

// TS complains without the following line
ForwardRefEditor.displayName = 'ForwardRefEditor';
