import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomation extends Document {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  lastRunAt?: Date;
  lastRunStatus?: 'success' | 'error';
  lastRunMessage?: string;
  config?: Record<string, unknown>;
}

const automationSchema = new Schema<IAutomation>(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    lastRunAt: { type: Date },
    lastRunStatus: { type: String, enum: ['success', 'error'] },
    lastRunMessage: { type: String },
    config: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Automation || mongoose.model<IAutomation>('Automation', automationSchema);
