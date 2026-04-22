'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextInput, TextArea, ToggleSwitch } from '@/components/cms/CMSComponents';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Settings saved successfully');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-12 w-1/3 bg-zinc-800 rounded-xl"></div><div className="h-64 bg-zinc-800 rounded-3xl"></div></div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-2">Settings</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Control your website globally.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-zinc-900 border border-transparent dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3"
        >
          {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Section title="General Information">
             <TextInput 
              label="Site Name" 
              value={settings.siteName} 
              onChange={(v) => setSettings({ ...settings, siteName: v })} 
             />
             <TextInput 
              label="Contact Email" 
              value={settings.contactEmail} 
              onChange={(v) => setSettings({ ...settings, contactEmail: v })} 
             />
             <TextInput 
              label="WhatsApp Number" 
              placeholder="+1234567890"
              value={settings.whatsappNumber || ''} 
              onChange={(v) => setSettings({ ...settings, whatsappNumber: v })} 
             />
          </Section>

          <Section title="Hero Section">
             <TextInput 
              label="Hero Headline" 
              value={settings.heroTitle} 
              onChange={(v) => setSettings({ ...settings, heroTitle: v })} 
             />
             <TextArea 
              label="Hero Subheadline" 
              value={settings.heroSubtitle} 
              onChange={(v) => setSettings({ ...settings, heroSubtitle: v })} 
             />
             <TextInput 
              label="Button Text" 
              value={settings.heroButtonText} 
              onChange={(v) => setSettings({ ...settings, heroButtonText: v })} 
             />
          </Section>
        </div>

        <div className="space-y-8">
          <Section title="SEO & Metadata">
             <TextInput 
              label="SEO Title" 
              value={settings.seoMetadata.title} 
              onChange={(v) => setSettings({ ...settings, seoMetadata: { ...settings.seoMetadata, title: v } })} 
             />
             <TextArea 
              label="SEO Description" 
              value={settings.seoMetadata.description} 
              onChange={(v) => setSettings({ ...settings, seoMetadata: { ...settings.seoMetadata, description: v } })} 
             />
          </Section>

          <Section title="External Integrations">
             <ToggleSwitch 
              label="Enable Smartsupp Live Chat" 
              enabled={settings.enableLiveChat} 
              onChange={(v) => setSettings({ ...settings, enableLiveChat: v })} 
             />
             <TextInput 
              label="Smartsupp Key" 
              value={settings.smartsuppId || ''} 
              onChange={(v) => setSettings({ ...settings, smartsuppId: v })} 
             />
             <TextInput 
              label="CV / Resume URL" 
              value={settings.cvUrl || ''} 
              onChange={(v) => setSettings({ ...settings, cvUrl: v })} 
             />
          </Section>

          <Section title="Footer">
             <TextArea 
              label="Footer Text" 
              rows={2}
              value={settings.footerText} 
              onChange={(v) => setSettings({ ...settings, footerText: v })} 
             />
          </Section>
        </div>
      </form>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 font-bold uppercase tracking-widest text-xs ${
              toast.type === 'success' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-circle-exclamation"></i>}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-8 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 space-y-6">
    <h3 className="text-xl font-display font-bold uppercase tracking-tight pb-4 border-b border-zinc-100 dark:border-zinc-800/50">{title}</h3>
    <div className="space-y-6 pt-2">
      {children}
    </div>
  </div>
);
