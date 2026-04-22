'use client';

import { motion } from 'motion/react';

const Services = ({ services }: { services: any[] }) => {
  const defaultServices = [
    { title: 'Full Stack Development', description: 'Building robust, scalable applications using modern stacks like MERN and Next.js.', icon: 'fa-code' },
    { title: 'UI/UX Design', description: 'Crafting pixel-perfect, accessible, and intuitive user interfaces with a focus on experience.', icon: 'fa-pen-nib' },
    { title: 'App Architecture', description: 'Designing enterprise-level system architectures for performance and security.', icon: 'fa-layer-group' },
  ];

  const data = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400">My Expertise</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">Growth-Driven Services</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-8 text-2xl">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
