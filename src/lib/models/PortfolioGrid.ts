import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioGridItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  order: number;
}

export interface IPortfolioGrid extends Document {
  categoryId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  items: IPortfolioGridItem[];
}

const portfolioGridItemSchema = new Schema<IPortfolioGridItem>(
  {
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const portfolioGridSchema = new Schema<IPortfolioGrid>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'PortfolioCategory', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    items: [portfolioGridItemSchema],
  },
  { timestamps: true }
);

portfolioGridSchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export default mongoose.models.PortfolioGrid ||
  mongoose.model<IPortfolioGrid>('PortfolioGrid', portfolioGridSchema);
