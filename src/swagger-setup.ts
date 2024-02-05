import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerSetup = (
  app: INestApplication,
  configService: ConfigService,
): void => {
  const { name } = configService.get('APP');
  const { path, version, enable } = configService.get('SWAGGER');

  if (!enable) return;

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(name + ' API Document')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup(path, app, document);
};
