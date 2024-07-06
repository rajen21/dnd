import { Ids, ColumnDocument, ColumnModel } from "../models/columns.model.js";
import db from "../models/index.js";
import { ObjectId } from "mongoose";
import { TaskDocument } from "./task.js";

const Column = db.columns;
const Task = db.tasks;

export interface Titles {
  todo: string;
  inprogress: string;
  completed: string;
};

export interface ColDoc {
  todo: ColumnDocument;
  inprogress: ColumnDocument;
  completed: ColumnDocument;
}

const statusMapping: any = {
  'todo': 'TO DO',
  'inprogress': 'IN PROGRESS',
  'completed': 'COMPLETED'
};

interface TaskType {
  _id: ObjectId;
  content: string;
  photo?: string;
}

interface ColumnType {
  _id: Ids,
  taskIds: ObjectId[],
}

type Column = {
  [key in Ids]: ColumnType
}

async function removeNull(key: Ids, ind: number) {
  await Column.findByIdAndUpdate(key, {
    $unset: {
      [`taskIds.${ind}`]: 1
    }
  });
  await Column.findByIdAndUpdate(key, {
    $pull: {
      taskIds: null
    }
  })
}

/**
 * Updates task from source column to target column at specified positions.
 * @param sourceKey Id of the source column
 * @param sourceInd Index of the task to be removed from the source column
 * @param targetKey Id of the target column
 * @param targetId Id of the task to be added to the target column
 * @param targetInd Index where the task should be added in the target column
 */
export async function updateTaskOfColumns(sourceKey: Ids, sourceInd: number, targetKey: Ids, targetId: string, targetInd: number): Promise<void> {
  try {
    await Column.findByIdAndUpdate(targetKey, {
      $push: {
        taskIds: {
          $each: [targetId],
          $position: targetInd
        }
      }
    });
    await removeNull(sourceKey, sourceInd);
  } catch (err) {
    console.error("Error occurred while updating task:", err);
    throw err; 
  }
}

/**
 * Adds a new task id to the specified column.
 * @param id Task id to add
 * @param key Column id where the task should be added
 */
export async function addTaskIntoColumn(id: string, key: Ids): Promise<void> {
  try {
    await Column.findByIdAndUpdate(key, {
      $push: { taskIds: id }
    });
  } catch (err) {
    console.error("Error occurred while adding new task:", err);
    throw err; 
  }
}

/**
 * Retrieves all columns and their tasks.
 * @returns A dictionary where keys are column ids and values are column objects.
 */
export async function getTasksOfColum(): Promise<{ [key: string]: ColumnDocument }> {
  try {
    const columns = await Column.find();
    const res = columns.reduce<{ [key: string]: ColumnDocument }>((acc: any, obj) => {
      acc[obj.id] = {
        id: obj.id,
        taskIds: obj.taskIds,
        title: statusMapping[obj.id] || obj.title
      };
      return acc;
    }, {});
    return res;
  } catch (err) {
    console.error("Error occurred while retrieving tasks:", err);
    throw err; 
  }
}


export async function removeNullis() {
  const taskData: TaskType[] = await Task.find();
  const columnData: ColumnType[] = await Column.find();
  let columnObj = {} as Column;

  const taskIdsSet = new Set(taskData.map(task => task?._id?.toString()));

  columnData.forEach((val) => {
    columnObj[val._id] = val;
  });

  for (const key in columnObj) {
    const column = columnObj[key as Ids];
    const columnKey = key as Ids
    column.taskIds.forEach(async (val, ind) => {
      if (!taskIdsSet.has(val?.toString())) {
        await removeNull(columnKey, ind);
      }
    })
  }
}