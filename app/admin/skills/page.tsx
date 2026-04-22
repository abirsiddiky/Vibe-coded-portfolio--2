'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextInput } from '@/components/cms/CMSComponents';

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSkills();
  }, []);

  const openEditModal = (skill: any = null) => {
    setEditingSkill(skill || {
      name: '',
      level: 80,
      category: 'Frontend',
      order: 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSkill._id ? 'PUT' : 'POST';
    const url = editingSkill._id ? `/api/skills/${editingSkill._id}` : '/api/skills';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkill),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-zinc-800 rounded-2xl animate-pulse"></div>)}</div>;

  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Skills</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your technical stack.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="px-8 py-4 bg-zinc-900 border border-transparent dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-3"
        >
          <i className="fa-solid fa-plus"></i>
          New Skill
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        {categories.length === 0 ? (
           <p className="opacity-50 italic">No skills added yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="space-y-6">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight pb-4 border-b border-zinc-200 dark:border-zinc-800">{cat}</h3>
              <div className="space-y-3">
                {skills.filter(s => s.category === cat).map((skill, i) => (
                  <div key={skill._id} className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1 pr-12">
                        <span className="font-bold uppercase tracking-tight">{skill.name}</span>
                        <span className="text-[10px] font-bold opacity-40">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-12">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          className="h-full bg-zinc-900 dark:bg-white"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(skill)} className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => deleteSkill(skill._id)} className="w-8 h-8 rounded-lg hover:bg-red-500 hover:text-white text-red-500 transition-colors">
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Skill Editor</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-3xl"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <TextInput label="Skill Name" value={editingSkill.name} onChange={(v) => setEditingSkill({ ...editingSkill, name: v })} />
                  <TextInput label="Category (e.g. Frontend)" value={editingSkill.category} onChange={(v) => setEditingSkill({ ...editingSkill, category: v })} />
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest opacity-40 px-1">Proficiency Level ({editingSkill.level}%)</label>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={editingSkill.level} 
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                      className="w-full accent-zinc-900 dark:accent-white" 
                    />
                  </div>
                  <TextInput label="Order" type="number" value={editingSkill.order.toString()} onChange={(v) => setEditingSkill({ ...editingSkill, order: parseInt(v) })} />
                  
                  <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                       Save Skill
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
