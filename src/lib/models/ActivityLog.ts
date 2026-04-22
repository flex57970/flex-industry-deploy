import mongoose, { Document, Schema } from 'mongoose';

export type ActivityType =
  | 'login_success'
  | 'login_failed'
  | 'admin_created'
  | 'user_deleted'
  | 'media_upload'
  | 'content_created'
  | 'content_deleted'
  | 'portfolio_created'
  | 'portfolio_deleted'
  | 'lead_received'
  | 'lead_status_changed'
  | 'backup_run'
  | 'report_sent'
  | 'security_alert';

export type Severity = 'info' | 'warning' | 'critical';

export interface IActivityLog extends Document {
  type: ActivityType;
  severity: Severity;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    type: { type: String, required: true, index: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    description: { type: String, required: true, maxlength: 1000 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Auto-cleanup: remove logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
