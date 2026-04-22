import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  footerText: string;
  contactEmail: string;
  whatsappNumber?: string;
  smartsuppId?: string;
  enableLiveChat: boolean;
  cvUrl?: string;
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Abir Siddiky' },
  heroTitle: { type: String, default: 'Crafting Digital Experiences' },
  heroSubtitle: { type: String, default: 'Full Stack Developer & Product Designer' },
  heroButtonText: { type: String, default: 'View My Work' },
  footerText: { type: String, default: '© 2024 Abir Siddiky. All rights reserved.' },
  contactEmail: { type: String, required: true },
  whatsappNumber: { type: String },
  smartsuppId: { type: String },
  enableLiveChat: { type: Boolean, default: true },
  cvUrl: { type: String },
  seoMetadata: {
    title: { type: String, default: 'Abir Siddiky | Portfolio' },
    description: { type: String, default: 'Personal portfolio of Abir Siddiky' },
    keywords: { type: [String], default: ['Portfolio', 'Developer', 'Designer'] }
  }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
