import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isInitialized = false;

async function bootstrapServer() {
  if (!isInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://naubpadi.vercel.app',
      'https://www.naubpadi.com.ng',
      'https://naubpadi.com.ng',
    ];
    const envOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : [];
    const allowedOrigins = [...defaultOrigins, ...envOrigins];

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        const isAllowed = allowedOrigins.some((allowed) => {
          const cleanAllowed = allowed.replace(/\/+$/, '');
          return cleanAllowed === '*' || cleanOrigin === cleanAllowed;
        });
        if (isAllowed) return callback(null, true);
        return callback(null, true);
      },
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    isInitialized = true;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const expressApp = await bootstrapServer();
  expressApp(req, res);
}
