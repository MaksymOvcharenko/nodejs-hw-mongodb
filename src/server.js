// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllStudents, getStudentById } from './services/students.js';
const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Please enter /students for url!',
    });
  });
  app.get('/students', async (req, res) => {
    const students = await getAllStudents();
    console.log(students);

    res.status(200).json({
      message: 'Successfully found contacts!',
      data: students,
    });
  });

  app.get('/students/:studentId', async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    // Відповідь, якщо контакт не знайдено
    if (!student) {
      res.status(404).json({
        message: 'Student not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      data: student,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
