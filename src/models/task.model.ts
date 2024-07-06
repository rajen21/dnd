import { Schema, Document, Model } from 'mongoose';

interface Task {
  content: string;
  photo?: string;
}

export interface TaskDocument extends Task, Document {
  id: string;
}

export default (mongoose: typeof import('mongoose')): Model<TaskDocument> => {
  const schemaDefinition: Record<keyof Task, any> = {
    content: { type: String, required: true },
    photo: { type: String },
  };

  const schema: Schema<TaskDocument> = new Schema(schemaDefinition);

  schema.method("toJSON", function (this: TaskDocument) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const tasks: Model<TaskDocument> = mongoose.model<TaskDocument>("tasks", schema);
  return tasks;
};
