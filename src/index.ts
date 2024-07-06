import express, { Application, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';

import connectDB from './db/index.js';
import { addTask, deleteTask, updateTask } from './controllers/task.js';
import { addTaskIntoColumn, updateTaskOfColumns } from './controllers/column.js';
import { makeObj } from './controllers/common.js';

dotenv.config({
  path: '.env',
});

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: `${process.env.ACCESS_ORIGIN}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.use(cors({
  origin: `${process.env.ACCESS_ORIGIN}`,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(`${process.env.DB_URL}`)
  .then(() => {
    io.on('connection', (socket: Socket) => {
      console.log('New client connected');

      socket.on("addNewTask", async (task, key) => {
        const id : string = await addTask(task);
        await addTaskIntoColumn(id, key);
        const obj = await makeObj();
        io.emit("tasksUpdated", obj);
      });

      socket.on("updateTask", async (task) => {
        updateTask(task);
        await makeObj();
        // io.emit("tasksUpdated", obj);
      });

      socket.on("updateTasks", async (sKey, sInd, tKey, tId, tInd) => {
        await updateTaskOfColumns(sKey, sInd,tKey,tId, parseInt(tInd));
        await makeObj();
        // io.emit("tasksUpdated", obj);
      }) 

      socket.on("deleteTask", async (id, key, taskIdInd) => {
        await deleteTask(id, key, taskIdInd);
        await makeObj();
        // io.emit("tasksUpdated", obj);
      })

      socket.on('updatedTasks', async () => {
        const obj = await makeObj();
        io.emit('tasksUpdated', obj);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    const PORT: string | number = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  })
  .catch((err: Error) => {
    console.error('MongoDb connection failed!!', err);
  });

export default app;
