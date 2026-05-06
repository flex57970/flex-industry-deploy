import mongoose, { Document, Schema } from 'mongoose';

export interface IVisit extends Document {
  path: string;
  visitorHash: string;       // hash anonymisé de IP+UA (RGPD-friendly)
  referrer: string;
  userAgent: string;
  device: 'mobile' | 'tablet' | 'desktop' | 'bot';
  country?: string;
  sessionId?: string;
  createdAt: Date;
}

const visitSchema = new Schema<IVisit>(
  {
    path: { type: String, required: true, index: true, maxlength: 500 },
    visitorHash: { type: String, required: true, index: true, maxlength: 64 },
    referrer: { type: String, default: '', maxlength: 500 },
    userAgent: { type: String, default: '', maxlength: 500 },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop', 'bot'], default: 'desktop' },
    country: { type: String, maxlength: 4 },
    sessionId: { type: String, maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL : on garde 1 an de données, après quoi MongoDB nettoie tout seul
visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });

// Index composé pour requêtes par jour/page
visitSchema.index({ createdAt: -1, path: 1 });

export default mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema);
