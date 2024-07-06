import { Schema, Document, Model } from 'mongoose';

export type Ids = "todo" | "inprogress" | "completed";

export interface ColumnDocument extends Document {
  id?: Ids;
  _id?: Ids;
  title?: "TO DO" | "IN PROGRESS" | "COMPLETED";
  taskIds: string[];
}

export interface ColumnModel extends Model<ColumnDocument> {}

export default (mongoose: typeof import('mongoose')): ColumnModel => {
  const columnSchemaDefinition: Record<string, any> = {
    _id: { type: String },
    taskIds: [{ type: String }],
  };

  const schema: Schema<ColumnDocument> = new Schema(columnSchemaDefinition);

  schema.method('toJSON', function (this: ColumnDocument) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Column: ColumnModel = mongoose.model<ColumnDocument, ColumnModel>('Column', schema);
  return Column;
};
