'use client';

import { useState } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const TextInput = ({ label, value, onChange, type = 'text', placeholder, required }: TextInputProps) => (
  <div className="space-y-2">
    <label className="text-xs uppercase font-bold tracking-widest opacity-60 px-1">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none"
      placeholder={placeholder}
    />
  </div>
);

interface TextAreaProps extends Omit<TextInputProps, 'type'> {
  rows?: number;
}

export const TextArea = ({ label, value, onChange, placeholder, required, rows = 4 }: TextAreaProps) => (
  <div className="space-y-2">
    <label className="text-xs uppercase font-bold tracking-widest opacity-60 px-1">{label}</label>
    <textarea
      required={required}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none resize-none"
      placeholder={placeholder}
    />
  </div>
);

export const ToggleSwitch = ({ label, enabled, onChange }: { label: string, enabled: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const RepeaterField = ({ label, items, onAdd, onRemove, renderItem }: { 
  label: string, 
  items: any[], 
  onAdd: () => void, 
  onRemove: (index: number) => void,
  renderItem: (item: any, index: number) => React.ReactNode 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-1">
      <label className="text-xs uppercase font-bold tracking-widest opacity-60">{label}</label>
      <button 
        type="button" 
        onClick={onAdd}
        className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg"
      >
        Add New
      </button>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="relative group p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  </div>
);
