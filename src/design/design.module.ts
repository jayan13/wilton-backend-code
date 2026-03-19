import { Module } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { Design } from './entities/design.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryModule } from '../library/library.module';
import { LibraryService } from '../library/library.service';
import { Library } from '../library/entities/library.entity';
import { AWSEmailService } from 'src/email/email.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    LibraryModule,
    TypeOrmModule.forFeature([Design, Library]),
  ],
  controllers: [DesignController],
  providers: [DesignService, LibraryService, AWSEmailService],
  exports: [DesignService],
})
export class DesignModule {}
