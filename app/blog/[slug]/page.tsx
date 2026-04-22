'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return null;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

  return (
    <main>
      <Navbar />
      
      <article className="pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
               <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">{new Date(blog.createdAt).toLocaleDateString()}</span>
               <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">{blog.author}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-medium uppercase tracking-tighter leading-[1.1] mb-8">{blog.title}</h1>
            <div className="flex flex-wrap justify-center gap-2">
               {blog.tags?.map((tag: string) => (
                 <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </motion.div>

          <div className="relative aspect-video w-full rounded-[40px] overflow-hidden mb-20 border border-zinc-200 dark:border-zinc-800">
             <img src={blog.thumbnail} alt={blog.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
          </div>

          <div className="prose prose-zinc dark:prose-invert prose-xl max-w-none mb-20" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          
          <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 flex items-center gap-8">
             <div className="w-20 h-20 rounded-full bg-zinc-300 shrink-0 overflow-hidden">
                <img src={`https://picsum.photos/seed/${blog.author}/200`} alt={blog.author} className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-1">Written By</p>
                <h4 className="text-xl font-display font-bold uppercase">{blog.author}</h4>
                <p className="text-sm text-zinc-500 mt-1">Full Stack Developer passionate about clean code and modern design.</p>
             </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
