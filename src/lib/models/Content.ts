import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  section: string;
  page: string;
  title: string;
  subtitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
  isActive: boolean;
}

const contentSchema = new Schema<IContent>(
  {
    section: { type: String, required: true },
    page: { type: String, required: true, enum: ['home', 'immobilier', 'automobile', 'parfumerie'] },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);
