import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmAsyncConfig } from './common/config';
import { EmailService, AWSEmailService } from './email/email.service';
import { LibraryModule } from './library/library.module';
import { CompanyColorModule } from './company-color/company-color.module';
import { DesignModule } from './design/design.module';
import { SampleRequestModule } from './sample-request/sample-request.module';
import { ColorCategoryModule } from './color-category/color-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV}`],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    LibraryModule,
    CompanyColorModule,
    DesignModule,
    SampleRequestModule,
    ColorCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, AWSEmailService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
