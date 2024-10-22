// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import routers from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();

  app.use(express.json());
  const corsOptions = {
    origin: 'http://localhost:5173/', // Домен твого фронтенду на Vercel
    credentials: true, // Дозволяє передавати куки
  };
  app.use(cors(corsOptions));

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Please enter /contacts for url! Thanks',
    });
  });
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(routers);
  app.use('*', notFoundHandler);
  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
