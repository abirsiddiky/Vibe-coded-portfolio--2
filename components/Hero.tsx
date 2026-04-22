'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const Hero = ({ data }: { data: any }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs uppercase tracking-widest font-semibold"
          >
            Available for new opportunities
          </motion.span>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] mt-6 mb-8 uppercase">
            {data?.heroTitle || 'Crafting Digital Experiences'}
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mb-10 leading-relaxed">
            {data?.heroSubtitle || 'Full Stack Developer & Product Designer building high-performance web applications with human-centered design.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:scale-105 transition-transform">
              {data?.heroButtonText || 'View My Work'}
            </button>
            <button className="px-8 py-4 border border-zinc-200 dark:border-zinc-800 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              Contact Me
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative aspect-square lg:aspect-auto h-[500px] lg:h-[700px] rounded-[40px] overflow-hidden"
        >
           <Image 
            src="https://picsum.photos/seed/abir/1200/1600" 
            alt="Abir Siddiky" 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Based in Earth
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-zinc-100 dark:bg-zinc-900/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-zinc-100 dark:bg-zinc-900/50 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Hero;
