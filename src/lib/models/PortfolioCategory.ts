import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioCategory extends Document {
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  order: number;
  isActive: boolean;
}

const portfolioCategorySchema = new Schema<IPortfolioCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioCategory ||
  mongoose.model<IPortfolioCategory>('PortfolioCategory', portfolioCategorySchema);
