import mongoose, { Model } from "mongoose";
import taskModel, { TaskDocument } from "./task.model.js";
import columnsModel, { ColumnModel } from "./columns.model.js";

export interface Database {
  mongoose: typeof mongoose;
  tasks: Model<TaskDocument>;
  columns: ColumnModel;
}

const database: Database = {
  mongoose,
  tasks: taskModel(mongoose),
  columns: columnsModel(mongoose),
};


export default database;