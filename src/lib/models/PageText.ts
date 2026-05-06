import mongoose, { Document, Schema } from 'mongoose';

export type FieldType = 'text' | 'textarea' | 'html' | 'list';

export interface IPageText extends Document {
  page: string;          // ex: "contact", "mentions-legales", "home"
  key: string;           // ex: "hero.title", "form.submit-label"
  label: string;         // libellé affiché à l'admin
  value: string;         // contenu texte (markup HTML autorisé pour type=html)
  type: FieldType;
  group?: string;        // section logique pour grouper l'admin
  order: number;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const pageTextSchema = new Schema<IPageText>(
  {
    page: { type: String, required: true, index: true, maxlength: 100 },
    key: { type: String, required: true, maxlength: 200 },
    label: { type: String, required: true, maxlength: 200 },
    value: { type: String, default: '', maxlength: 20000 },
    type: { type: String, enum: ['text', 'textarea', 'html', 'list'], default: 'text' },
    group: { type: String, default: 'Général', maxlength: 100 },
    order: { type: Number, default: 0 },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

pageTextSchema.index({ page: 1, key: 1 }, { unique: true });

export default mongoose.models.PageText || mongoose.model<IPageText>('PageText', pageTextSchema);
