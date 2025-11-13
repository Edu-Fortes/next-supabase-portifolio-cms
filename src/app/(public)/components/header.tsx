import Link from 'next/link';

export default function Header() {
  return (
    <header className='border-b'>
      <nav className='container mx-auto max-w-5xl p-4 flex justify-between items-center'>
        <Link href='/' className='font-bold text-lg'>
          My Name
        </Link>
        <div className='flex gap-6'>
          <Link
            href='/portfolio'
            className='text-muted-foreground hover:text-primary'
          >
            Portfolio
          </Link>
          <Link
            href='/blog'
            className='text-muted-foreground hover:text-primary'
          >
            Blog
          </Link>
          <Link
            href='/dashboard'
            className='text-muted-foreground hover:text-primary'
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
