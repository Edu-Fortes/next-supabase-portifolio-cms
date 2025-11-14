import Link from 'next/link';
import { SignInForm } from './sign-in-form';
import { ForceResetPassword } from './force-reset-form';

export default function SignInPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <SignInForm />
      <Link
        href='/forgot-password'
        className='underline text-sm font-semibold mt-4'
      >
        Forgot password
      </Link>
      <ForceResetPassword className='mt-6 w-full max-w-sm' />
    </div>
  );
}
