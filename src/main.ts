import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './app.config.global';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    applyGlobalConfig(app);

    await app.listen(3000);
}

bootstrap();
