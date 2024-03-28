import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          host: configService.get('MAIL.HOST'),
          secure: false,
          port: +configService.get('MAIL.PORT'),
          auth: {
            pass: configService.get('MAIL.MAIL_PASS'),
            user: configService.get('MAIL.MAIL_USER'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
