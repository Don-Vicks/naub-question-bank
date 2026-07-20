import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV !== 'production') {
        // In development, allow localhost and any local network IP / origin
        return callback(null, true);
      }

      const defaultOrigins = [
        'http://localhost:3001',
        'https://naubpadi.vercel.app',
      ];
      const envOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : [];
      const allowedOrigins = [...defaultOrigins, ...envOrigins];

      const cleanOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.some(
          (allowed) =>
            allowed === '*' ||
            cleanOrigin === allowed.replace(/\/+$/, '') ||
            cleanOrigin.startsWith(allowed.replace(/\/+$/, '')),
        )
      ) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
