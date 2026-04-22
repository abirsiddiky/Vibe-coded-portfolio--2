'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextInput, TextArea, ToggleSwitch } from '@/components/cms/CMSComponents';
import Image from 'next/image';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const openEditModal = (project: any = null) => {
    setEditingProject(project || {
      title: '',
      slug: '',
      description: '',
      content: '',
      thumbnail: 'https://picsum.photos/seed/project/800/600',
      technologies: [],
      isPublished: false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject._id ? 'PUT' : 'POST';
    const url = editingProject._id ? `/api/projects/${editingProject._id}` : '/api/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
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
           <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Projects</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your creative portfolio.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="px-8 py-4 bg-zinc-900 border border-transparent dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-3"
        >
          <i className="fa-solid fa-plus"></i>
          New Project
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative p-6 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-6">
              <Image 
                src={project.thumbnail} 
                alt={project.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(project)}
                  className="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-xl hover:bg-zinc-100 transition-colors"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                  onClick={() => deleteProject(project._id)}
                  className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl hover:bg-red-600 transition-colors"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              {!project.isPublished && (
                 <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Draft
                 </div>
              )}
            </div>
            
            <h3 className="text-2xl font-display font-bold uppercase mb-2 truncate">{project.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-6">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: string) => (
                <span key={tech} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-tighter opacity-70">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Editor Modal */}
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
                    {editingProject?._id ? 'Edit Project' : 'New Project'}
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
                          value={editingProject.title} 
                          onChange={(v) => {
                            const slug = generateSlug(v);
                            setEditingProject({ ...editingProject, title: v, slug });
                          }} 
                        />
                        <TextInput 
                          label="Slug" 
                          value={editingProject.slug} 
                          onChange={(v) => setEditingProject({ ...editingProject, slug: v })} 
                        />
                        <TextArea 
                          label="Short Description" 
                          value={editingProject.description} 
                          onChange={(v) => setEditingProject({ ...editingProject, description: v })} 
                        />
                     </div>
                     <div className="space-y-6">
                        <TextInput 
                          label="Thumbnail URL" 
                          value={editingProject.thumbnail} 
                          onChange={(v) => setEditingProject({ ...editingProject, thumbnail: v })} 
                        />
                        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                           <label className="text-xs uppercase font-bold tracking-widest opacity-40 block mb-4">Technologies (comma separated)</label>
                           <input 
                              type="text"
                              value={editingProject.technologies?.join(', ')}
                              onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full bg-transparent border-none outline-none font-medium"
                              placeholder="Next.js, Tailwind, etc."
                           />
                        </div>
                        <ToggleSwitch 
                          label="Published" 
                          enabled={editingProject.isPublished} 
                          onChange={(v) => setEditingProject({ ...editingProject, isPublished: v })} 
                        />
                     </div>
                  </div>

                  <TextArea 
                    label="Full Content (Markdown/HTML)" 
                    rows={10}
                    value={editingProject.content} 
                    onChange={(v) => setEditingProject({ ...editingProject, content: v })} 
                  />

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Save Project
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
