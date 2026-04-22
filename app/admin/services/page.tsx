'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextInput, TextArea } from '@/components/cms/CMSComponents';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/settings'); // Services might be in settings or separate
      // I'll stick to separate models as I created them
      const servRes = await fetch('/api/services');
      const data = await servRes.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  const openEditModal = (service: any = null) => {
    setEditingService(service || {
      title: '',
      description: '',
      icon: 'fa-star',
      order: 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // I need to make sure the endpoint exists
    const method = editingService._id ? 'PUT' : 'POST';
    const url = editingService._id ? `/api/services/${editingService._id}` : '/api/services';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // I need to add service routes to the backend first
  
  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-800 rounded-3xl animate-pulse"></div>)}</div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Services</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Define your professional offerings.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="px-8 py-4 bg-zinc-900 border border-transparent dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-3"
        >
          <i className="fa-solid fa-plus"></i>
          New Service
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service, i) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-2xl shrink-0">
               <i className={`fa-solid ${service.icon}`}></i>
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-xl font-display font-bold uppercase truncate">{service.title}</h3>
               <p className="text-xs text-zinc-500 line-clamp-1">{service.description}</p>
            </div>
            <div className="flex gap-2">
               <button onClick={() => openEditModal(service)} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <i className="fa-solid fa-pen"></i>
               </button>
               <button onClick={() => deleteService(service._id)} className="w-10 h-10 rounded-full border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <i className="fa-solid fa-trash-can"></i>
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Service Editor</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-3xl"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <TextInput label="Title" value={editingService.title} onChange={(v) => setEditingService({ ...editingService, title: v })} />
                  <TextArea label="Description" rows={3} value={editingService.description} onChange={(v) => setEditingService({ ...editingService, description: v })} />
                  <TextInput label="FontAwesome Icon (e.g. fa-code)" value={editingService.icon} onChange={(v) => setEditingService({ ...editingService, icon: v })} />
                  <TextInput label="Order" type="number" value={editingService.order.toString()} onChange={(v) => setEditingService({ ...editingService, order: parseInt(v) })} />
                  
                  <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                       Save Service
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
