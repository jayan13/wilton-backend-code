import { Module } from '@nestjs/common';
import { SampleRequestService } from './sample-request.service';
import { SampleRequestController } from './sample-request.controller';
import { SampleRequest } from './entities/sample-request.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignModule } from 'src/design/design.module';
import { DesignService } from 'src/design/design.service';
import { Design } from 'src/design/entities/design.entity';
import { LibraryService } from '../library/library.service';
import { Library } from '../library/entities/library.entity';
import { EmailService, AWSEmailService } from 'src/email/email.service';
import { CompanyColor } from 'src/company-color/entities/company-color.entity';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    DesignModule,
    TypeOrmModule.forFeature([SampleRequest, Design, Library, CompanyColor]),
  ],
  controllers: [SampleRequestController],
  providers: [
    SampleRequestService,
    DesignService,
    LibraryService,
    EmailService,
    AWSEmailService,
  ],
})
export class SampleRequestModule {}
