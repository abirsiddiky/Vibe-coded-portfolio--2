import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number; // 0-100
  category: string;
  icon?: string;
  order: number;
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 80 },
  category: { type: String, required: true }, // e.g., 'Frontend', 'Backend', 'Tools'
  icon: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
