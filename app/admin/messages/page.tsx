'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-zinc-800 rounded-2xl animate-pulse"></div>)}</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Inbox</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{messages.filter(m => !m.isRead).length} unread messages.</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
          {messages.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-[40px] opacity-40">
               <i className="fa-solid fa-ghost text-4xl mb-4"></i>
               <p className="font-bold uppercase tracking-widest text-xs">No messages yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => { setSelectedMessage(msg); if (!msg.isRead) markRead(msg._id); }}
                className={`w-full text-left p-6 rounded-3xl border transition-all ${
                  selectedMessage?._id === msg._id 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-xl' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold truncate max-w-[140px] uppercase tracking-tight">{msg.name}</h3>
                   {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></span>}
                </div>
                <p className={`text-xs truncate ${selectedMessage?._id === msg._id ? 'opacity-70' : 'text-zinc-500'}`}>
                   {msg.subject || 'No Subject'}
                </p>
                <p className="text-[10px] mt-4 opacity-40 font-bold">
                   {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
             {selectedMessage ? (
                <motion.div
                  key={selectedMessage._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-10 md:p-12 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                   <div className="flex justify-between items-start mb-10">
                      <div>
                         <h2 className="text-3xl font-display font-bold uppercase mb-2 leading-tight">{selectedMessage.subject || 'No Subject'}</h2>
                         <p className="text-sm font-medium text-zinc-500">{selectedMessage.email}</p>
                      </div>
                      <button 
                        onClick={() => deleteMsg(selectedMessage._id)}
                        className="w-10 h-10 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                         <i className="fa-solid fa-trash-can"></i>
                      </button>
                   </div>

                   <div className="space-y-8">
                      <div className="p-8 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800/50">
                         <p className="text-sm font-bold uppercase tracking-widest opacity-40 mb-4">Message</p>
                         <p className="whitespace-pre-wrap leading-relaxed text-lg">{selectedMessage.message}</p>
                      </div>

                      <div className="flex flex-wrap gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Received At</p>
                            <p className="text-xs font-bold">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">IP Address</p>
                            <p className="text-xs font-bold font-mono">{selectedMessage.ipAddress || 'unknown'}</p>
                         </div>
                         <a 
                           href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                           className="ml-auto px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                         >
                            Reply to {selectedMessage.name}
                         </a>
                      </div>
                   </div>
                </motion.div>
             ) : (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[40px] opacity-30">
                   <i className="fa-solid fa-envelope-open-text text-6xl mb-6"></i>
                   <p className="text-lg font-bold uppercase tracking-widest">Select a message to read.</p>
                </div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
