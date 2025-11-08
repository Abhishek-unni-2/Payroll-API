import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Global crash handlers for hidden runtime errors
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
  });

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3060;

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
