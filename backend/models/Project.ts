import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  isPublished: boolean;
  order: number;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  liveUrl: { type: String },
  githubUrl: { type: String },
  isPublished: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
