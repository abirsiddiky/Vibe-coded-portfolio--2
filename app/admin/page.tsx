'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [msgRes, projRes, blogRes] = await Promise.all([
          fetch('/api/messages'),
          fetch('/api/projects'),
          fetch('/api/blogs')
        ]);
        
        const messages = await msgRes.json();
        const projects = await projRes.json();
        const blogs = await blogRes.json();

        setStats({
          messages: messages.length,
          unread: messages.filter((m: any) => !m.isRead).length,
          projects: projects.length,
          blogs: blogs.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Messages', value: stats?.messages || 0, icon: 'fa-message', color: 'bg-blue-500', href: '/admin/messages' },
    { name: 'Unread Messages', value: stats?.unread || 0, icon: 'fa-envelope-open', color: 'bg-amber-500', href: '/admin/messages' },
    { name: 'Active Projects', value: stats?.projects || 0, icon: 'fa-rocket', color: 'bg-green-500', href: '/admin/projects' },
    { name: 'Blog Posts', value: stats?.blogs || 0, icon: 'fa-newspaper', color: 'bg-purple-500', href: '/admin/blogs' },
  ];

  if (loading) return (
     <div className="flex flex-col gap-8">
        <div className="h-12 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-[32px] animate-pulse"></div>)}
        </div>
     </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2 tracking-tight">Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Welcome back, Abir. Here is what is happening today.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Link href={card.href} className="group p-8 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col h-full shadow-sm hover:shadow-xl">
                <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center text-xl mb-6 shadow-lg shadow-zinc-200 dark:shadow-none`}>
                  <i className={`fa-solid ${card.icon}`}></i>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">{card.name}</h3>
                <p className="text-4xl font-display font-bold group-hover:scale-110 transition-transform origin-left">{card.value}</p>
             </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-bold uppercase">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
               {[
                 { name: 'Add Project', icon: 'fa-plus', href: '/admin/projects/new' },
                 { name: 'Write Blog', icon: 'fa-pen-to-square', href: '/admin/blogs/new' },
                 { name: 'View Website', icon: 'fa-arrow-up-right-from-square', href: '/' },
                 { name: 'Security Audit', icon: 'fa-shield-halved', href: '#' },
               ].map((action, i) => (
                 <Link key={i} href={action.href} className="flex items-center gap-4 p-6 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-3xl hover:opacity-90 transition-opacity font-bold uppercase tracking-widest text-xs">
                    <i className={`fa-solid ${action.icon}`}></i>
                    {action.name}
                 </Link>
               ))}
            </div>
         </div>
         
         <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold uppercase">System Status</h2>
            <div className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">MongoDB</span>
                  <span className="text-xs font-bold text-green-500 uppercase">Connected</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Security</span>
                  <span className="text-xs font-bold text-green-500 uppercase">Hardened</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">API Status</span>
                  <span className="text-xs font-bold text-green-500 uppercase">Online</span>
               </div>
               <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Environment</p>
                  <p className="text-xs font-medium mt-1">Production-Ready Sandbox</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
