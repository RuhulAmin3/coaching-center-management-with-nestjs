import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateStudentDTO } from './modules/user/dto/create-student.dto';

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
    extraModels: [CreateStudentDTO],
  });
  SwaggerModule.setup(path, app, document);
};
