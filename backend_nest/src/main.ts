import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('A comprehensive API for User')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('User', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: [],
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'User API Documentation',
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 5557);
}
bootstrap();
