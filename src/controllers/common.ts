import { getTasksOfColum, removeNullis } from "./column.js";
import { getTasks } from "./task.js";

export async function makeObj () {
  const tasks = await getTasks();
  const columns = await getTasksOfColum();
  await removeNullis();
  const columnOrder = Object.keys(columns);
  return {
    tasks, columns, columnOrder
  }
}