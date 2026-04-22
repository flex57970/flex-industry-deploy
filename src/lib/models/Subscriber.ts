import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  isActive: boolean;
  unsubscribeToken: string;
  source: string;
  createdAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, index: true, maxlength: 200 },
    name: { type: String, maxlength: 200 },
    isActive: { type: Boolean, default: true },
    unsubscribeToken: { type: String, required: true, unique: true },
    source: { type: String, default: 'website' },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', subscriberSchema);
