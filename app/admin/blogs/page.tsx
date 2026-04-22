'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextInput, TextArea, ToggleSwitch } from '@/components/cms/CMSComponents';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, []);

  const openEditModal = (blog: any = null) => {
    setEditingBlog(blog || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      thumbnail: 'https://picsum.photos/seed/blog/800/600',
      tags: [],
      isPublished: false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingBlog._id ? 'PUT' : 'POST';
    const url = editingBlog._id ? `/api/blogs/${editingBlog._id}` : '/api/blogs';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-zinc-800 rounded-[32px] animate-pulse"></div>)}</div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Blog Posts</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Share your thoughts and insights.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="px-8 py-4 bg-zinc-900 border border-transparent dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-3"
        >
          <i className="fa-solid fa-plus"></i>
          New Post
        </button>
      </header>

      <div className="space-y-4">
        {blogs.map((blog, i) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col md:flex-row items-center gap-8 p-6 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800"
          >
            <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
               <img src={blog.thumbnail} alt={blog.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-display font-bold uppercase truncate">{blog.title}</h3>
                  {!blog.isPublished && <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Draft</span>}
               </div>
               <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 italic">{blog.excerpt}</p>
               <p className="text-[10px] mt-4 font-bold uppercase tracking-widest opacity-40">
                  {new Date(blog.createdAt).toLocaleDateString()} • {blog.tags?.join(', ')}
               </p>
            </div>

            <div className="flex gap-2">
               <button 
                onClick={() => openEditModal(blog)}
                className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
               >
                  <i className="fa-solid fa-pen-to-square"></i>
               </button>
               <button 
                onClick={() => deleteBlog(blog._id)}
                className="w-12 h-12 rounded-2xl border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
               >
                  <i className="fa-solid fa-trash-can"></i>
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Editor Modal is very similar to Project Modal, ideally shared or abstracted */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-display font-bold uppercase tracking-tight">
                    {editingBlog?._id ? 'Edit Post' : 'New Post'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-3xl hover:rotate-90 transition-transform">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <TextInput 
                          label="Title" 
                          value={editingBlog.title} 
                          onChange={(v) => {
                            const slug = generateSlug(v);
                            setEditingBlog({ ...editingBlog, title: v, slug });
                          }} 
                        />
                        <TextInput 
                          label="Slug" 
                          value={editingBlog.slug} 
                          onChange={(v) => setEditingBlog({ ...editingBlog, slug: v })} 
                        />
                        <TextArea 
                          label="Excerpt" 
                          rows={3}
                          value={editingBlog.excerpt} 
                          onChange={(v) => setEditingBlog({ ...editingBlog, excerpt: v })} 
                        />
                     </div>
                     <div className="space-y-6">
                        <TextInput 
                          label="Thumbnail URL" 
                          value={editingBlog.thumbnail} 
                          onChange={(v) => setEditingBlog({ ...editingBlog, thumbnail: v })} 
                        />
                        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                           <label className="text-xs uppercase font-bold tracking-widest opacity-40 block mb-4">Tags (comma separated)</label>
                           <input 
                              type="text"
                              value={editingBlog.tags?.join(', ')}
                              onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full bg-transparent border-none outline-none font-medium"
                              placeholder="Tech, Web, Life"
                           />
                        </div>
                        <ToggleSwitch 
                          label="Published" 
                          enabled={editingBlog.isPublished} 
                          onChange={(v) => setEditingBlog({ ...editingBlog, isPublished: v })} 
                        />
                     </div>
                  </div>

                  <TextArea 
                    label="Full Content (Markdown/HTML)" 
                    rows={10}
                    value={editingBlog.content} 
                    onChange={(v) => setEditingBlog({ ...editingBlog, content: v })} 
                  />

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Save Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-10 py-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
