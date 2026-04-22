'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const Projects = ({ projects }: { projects: any[] }) => {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400">Featured Work</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">Selected Projects</h2>
          </div>
          <Link href="/projects" className="text-sm font-bold uppercase tracking-wider border-b-2 border-zinc-900 dark:border-zinc-100 pb-1">
            See All Projects
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))
          ) : (
            <>
              <ProjectCard 
                project={{ 
                  title: 'Nebula Dashboard', 
                  description: 'An enterprise-grade analytics dashboard with real-time data visualization.', 
                  thumbnail: 'https://picsum.photos/seed/nebula/800/600',
                  slug: 'nebula-dashboard',
                  technologies: ['Next.js', 'TypeScript', 'D3.js']
                }} 
                index={0} 
              />
              <ProjectCard 
                project={{ 
                  title: 'Fintech Mobile App', 
                  description: 'A revolutionary way to manage personal finances with AI-driven insights.', 
                  thumbnail: 'https://picsum.photos/seed/fintech/800/600',
                  slug: 'fintech-app',
                  technologies: ['React Native', 'Node.js', 'MongoDB']
                }} 
                index={1} 
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`} className="block overflow-hidden rounded-[32px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={project.thumbnail} 
            alt={project.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors duration-500"></div>
        </div>
      </Link>
      <div className="mt-8 px-4 flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-display font-bold mb-3 uppercase">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map((tech: string) => (
              <span key={tech} className="text-[10px] uppercase tracking-tighter px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-full font-bold opacity-60">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <Link href={`/projects/${project.slug}`} className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all">
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </Link>
      </div>
    </motion.div>
  );
};

export default Projects;
