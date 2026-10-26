import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // Global Exception Filter & Transform Interceptor
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Request-Id, X-Idempotency-Key'
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Lumora + Cypher Swift Partner Network API')
    .setDescription(
      'Enterprise Business Development Partner Network REST API managing onboarding, lead duplicate detection, sales meetings, diagnostic/service deals, and immutable commission ledger.'
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Registration, login, OTP verification, tokens and password reset')
    .addTag('Profiles & Onboarding', 'Partner profile management and onboarding completion gates')
    .addTag('Verification', 'Identity verification records and session status')
    .addTag('Agreements & Conduct', 'Legal partner agreements and timestamped acceptances')
    .addTag('Learning & Training Hub', 'Training modules, quizzes, and completion tracking')
    .addTag('Services Catalogue', 'Service guides, ICP, objection handling, and Admin CMS')
    .addTag('Leads & Ownership', 'Lead registration, duplicate detection, and claim disputes')
    .addTag('Meetings & Calendar', 'Client meetings, rescheduling, and qualification outcomes')
    .addTag('Deals & Payments Pipeline', 'Diagnostic and service proposals, payment verification, and handoffs')
    .addTag('Incentive & Commission Ledger', 'Immutable financial ledger, dispute requests, and approval workflow')
    .addTag('Finance & Payouts Console', 'Payout batch processing, payment recording, and bonus evaluation')
    .addTag('Notifications Centre', 'In-app notifications and delivery preferences')
    .addTag('Support Tickets', 'Help desk tickets and payout dispute resolutions')
    .addTag('Admin Console Management', 'Partner approval queue, audit events, and funnel analytics')
    .addTag('System Health', 'Liveness and readiness probes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 API Server running at: http://localhost:${port}/api/v1`);
  logger.log(`📚 OpenAPI / Swagger Docs available at: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check at: http://localhost:${port}/api/v1/health`);
}

bootstrap();
