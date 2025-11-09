import Link from 'next/link';
import { SignInForm } from './sign-in-form';

export default function SignInPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <SignInForm />
      <Link href='/forgot-password' className='underline text-sm font-semibold'>
        Forgot password
      </Link>
    </div>
  );
}
