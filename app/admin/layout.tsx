'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: 'fa-gauge-high' },
  { name: 'Site Settings', href: '/admin/settings', icon: 'fa-sliders' },
  { name: 'Projects', href: '/admin/projects', icon: 'fa-rocket' },
  { name: 'Blog Posts', href: '/admin/blogs', icon: 'fa-newspaper' },
  { name: 'Services', href: '/admin/services', icon: 'fa-wand-magic-sparkles' },
  { name: 'Skills', href: '/admin/skills', icon: 'fa-brain' },
  { name: 'Messages', href: '/admin/messages', icon: 'fa-inbox' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simple ping to a protected route to check auth
        const res = await fetch('/api/settings'); // This is public but I should check a protected one
        // More robust: check a protected route or session endpoint
        // For now, assume if we are here we should check if we can actually reach admin-only data
        const protectedCheck = await fetch('/api/messages');
        if (protectedCheck.status === 401 || protectedCheck.status === 403) {
           router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white font-display text-2xl animate-pulse uppercase tracking-widest">Securing Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-8 hidden lg:flex fixed h-screen overflow-y-auto no-scrollbar">
        <Link href="/admin" className="text-3xl font-display font-bold tracking-tighter mb-12 block">
          CMS<span className="text-zinc-500">.</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl' 
                    : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} w-6 text-center`}></i>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
          >
            <i className="fa-solid fa-power-off w-6 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-8 md:p-12">
        <header className="flex justify-between items-center mb-12 md:hidden">
            <Link href="/admin" className="text-2xl font-display font-bold tracking-tighter">
              CMS<span className="text-zinc-500">.</span>
            </Link>
            <button onClick={handleLogout} className="text-red-500"><i className="fa-solid fa-power-off"></i></button>
        </header>

        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
