import mongoose, { Document, Schema } from 'mongoose';

export type LeadStatus = 'nouveau' | 'contacte' | 'devis' | 'gagne' | 'perdu';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  status: LeadStatus;
  source: string;
  notes: string;
  notionPageId?: string;
  lastContactedAt?: Date;
  followUp3SentAt?: Date;
  followUp7SentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, maxlength: 200 },
    email: { type: String, required: true, maxlength: 200, index: true },
    phone: { type: String, maxlength: 50 },
    company: { type: String, maxlength: 200 },
    service: { type: String, required: true, maxlength: 100 },
    message: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['nouveau', 'contacte', 'devis', 'gagne', 'perdu'],
      default: 'nouveau',
      index: true,
    },
    source: { type: String, default: 'contact-form' },
    notes: { type: String, default: '', maxlength: 10000 },
    notionPageId: { type: String },
    lastContactedAt: { type: Date },
    followUp3SentAt: { type: Date },
    followUp7SentAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);
