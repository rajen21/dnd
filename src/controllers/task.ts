import { Ids } from "../models/columns.model.js";
import db from "../models/index.js";
import { Document, ObjectId } from "mongoose";

interface Task extends Document {
  id: string;
  content: string;
  photo?: string;
}

export interface TaskDocument extends Task {}

const TaskModel = db.tasks;
const ColumnModel = db.columns;

/**
 * Updates an existing task.
 * @param task Task object containing updated data
 */
export async function updateTask(task: Task): Promise<void> {
  try {
    const {id, ...dataToUpdate} = { ...task };
    await TaskModel.findByIdAndUpdate(task.id, dataToUpdate);
  } catch (err) {
    console.error("Error occurred while updating task:", err);
    throw err; 
  }
}

/**
 * Adds a new task.
 * @param task Task object containing data for the new task
 * @returns The _id of the newly added task
 */
export async function addTask(task: Task): Promise<string> {
  try {
    const newTask = new TaskModel(task);
    const savedTask = await newTask.save();
    const id = savedTask._id as string | ObjectId;    
    
    return id.toString();
  } catch (err) {
    console.error("Error occurred while adding new task:", err);
    throw err; 
  }
}

/**
 * Retrieves all tasks.
 * @returns Array of all Task documents
 */
export async function getTasks(): Promise<TaskDocument[]> {
  try {
    return await TaskModel.find();
  } catch (err) {
    console.error("Error occurred while retrieving tasks:", err);
    throw err; 
  }
}


export async function deleteTask(id: ObjectId, key: Ids, taskIdInd: number) {
    await TaskModel.findByIdAndDelete(id);
    await ColumnModel.findByIdAndUpdate(key, {
      $unset: {
          [`taskIds.${taskIdInd}`]: 1
      }
    });
    await ColumnModel.findByIdAndUpdate(key, {
      $pull: {
        taskIds: null
      }
    });
}