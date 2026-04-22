'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?publishedOnly=true');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-24 bg-zinc-50 dark:bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Insights & Articles</span>
            <h1 className="text-6xl md:text-8xl font-display font-medium uppercase mt-4 mb-8">My Blog</h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">Thoughts on design, engineering, and the future of technology.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="aspect-video bg-zinc-200 dark:bg-zinc-900 rounded-[32px] animate-pulse"></div>)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 opacity-30">
               <p className="text-2xl font-display uppercase tracking-widest">No articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${blog.slug}`} className="block overflow-hidden rounded-[32px] mb-8">
                     <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <img 
                          src={blog.thumbnail} 
                          alt={blog.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                     </div>
                  </Link>
                  <div className="px-4">
                     <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
                     </div>
                     <Link href={`/blog/${blog.slug}`}>
                        <h2 className="text-3xl font-display font-bold uppercase leading-tight hover:text-zinc-500 transition-colors">{blog.title}</h2>
                     </Link>
                     <p className="mt-4 text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                     </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
