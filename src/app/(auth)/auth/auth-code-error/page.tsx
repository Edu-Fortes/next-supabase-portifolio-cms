import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthCodeErrorPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was an error processing your authentication link.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            The link may have expired or is invalid. Please try requesting a new
            password reset link.
          </p>
          <Button asChild className='w-full'>
            <Link href='/sign-in'>Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
