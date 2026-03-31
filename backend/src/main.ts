import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React Native and PWA
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server (PWA)
      'http://localhost:5174', // Vite dev server (alternate port)
      'http://localhost:3000', // React Native dev
      'http://localhost:8081', // React Native Metro
      'http://127.0.0.1:5173',
      'http://192.168.0.16:5173',
      'http://192.168.0.16:3000',
      'http://192.168.0.16:8081',
      /^https:\/\/.*\.vercel\.app$/, // Vercel deployments
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}
bootstrap();
