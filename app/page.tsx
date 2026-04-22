'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await fetch('/api/settings');
        const settings = await settingsRes.json();
        
        const projectsRes = await fetch('/api/projects?publishedOnly=true');
        const projects = await projectsRes.json();

        setData({ settings, projects });
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-950 z-[100]">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-4xl font-display font-bold"
        >
          ABIR<span className="text-zinc-500">.</span>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative">
      <Navbar />
      <Hero data={data?.settings || {}} />
      
      <section id="about" className="py-24 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-none uppercase">
            A design-led engineer building bridges between <span className="text-zinc-400">vision</span> and <span className="italic">reality</span>.
          </h2>
          <div className="space-y-8">
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              With over 5 years of experience in the industry, I specialize in crafting high-performance user interfaces and building modular, secure backends. I believe that good design is invisible and that engineering should be purposeful.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-display font-bold mb-1">20+</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Projects Completed</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold mb-1">100%</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services services={[]} />
      <Projects projects={data?.projects || []} />
      
      {/* Experience Section (CMS could handle this too, for now manual or simple loop) */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
           <span className="text-xs uppercase tracking-widest font-bold opacity-40">My Journey</span>
           <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-16 uppercase">Professional Experience</h2>
           
           <div className="space-y-12">
             {[
               { role: 'Senior Product Engineer', company: 'Digital Agency', period: '2022 - Present', desc: 'Leading frontend architecture and mentoring junior developers in React/Next.js workflows.' },
               { role: 'Full Stack Developer', company: 'SaaS Startup', period: '2020 - 2022', desc: 'Developed enterprise-grade CRM features and optimized database performance by 40%.' },
               { role: 'Web Developer', company: 'Freelance', period: '2018 - 2020', desc: 'Collaborated with international clients to deliver pixel-perfect marketing sites.' }
             ].map((exp, i) => (
               <div key={i} className="group grid md:grid-cols-4 gap-6 p-8 border border-zinc-800 rounded-3xl hover:bg-zinc-800/50 transition-colors">
                 <p className="text-zinc-500 font-medium">{exp.period}</p>
                 <div className="md:col-span-2">
                   <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                   <p className="text-zinc-400">{exp.desc}</p>
                 </div>
                 <p className="md:text-right font-display font-bold text-xl uppercase tracking-tighter">{exp.company}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      <Contact />
      <Footer />

      {/* Floating Elements */}
      <a 
        href={`https://wa.me/${data?.settings?.whatsappNumber || ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform z-40"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-sm shadow-xl hover:-translate-y-2 transition-transform z-40"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </main>
  );
}
