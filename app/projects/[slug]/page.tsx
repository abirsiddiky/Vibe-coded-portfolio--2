'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return null;
  if (!project) return <div className="min-h-screen flex items-center justify-center">Project not found</div>;

  return (
    <main>
      <Navbar />
      
      <section className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-20 items-end mb-20"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Featured Project</span>
              <h1 className="text-6xl md:text-8xl font-display font-medium uppercase mt-6 tracking-tighter leading-none">{project.title}</h1>
            </div>
            <div className="space-y-8">
              <p className="text-xl text-zinc-500 font-medium leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-3">
                 {project.technologies?.map((tech: string) => (
                   <span key={tech} className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest">{tech}</span>
                 ))}
              </div>
            </div>
          </motion.div>

          <div className="relative aspect-video w-full rounded-[40px] overflow-hidden mb-24 border border-zinc-200 dark:border-zinc-800">
             <Image src={project.thumbnail} alt={project.title} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="max-w-4xl mx-auto">
             <div className="prose prose-zinc dark:prose-invert prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: project.content }}></div>
             
             <div className="mt-20 pt-20 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-8">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" className="px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs">Live Preview</a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" className="px-10 py-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold uppercase tracking-widest text-xs">Source Code</a>
                )}
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
