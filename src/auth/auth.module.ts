import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { JwtStrategy, JwtRefreshTokenStrategy } from './strategy';
import { EmailService, AWSEmailService } from 'src/email/email.service';
import { LibraryService } from '../library/library.service';
import { Library } from '../library/entities/library.entity';
import DatabaseFilesService from './databaseFiles.service';
import DatabaseFile from './entities/databaseFile.entity';
import DatabaseFilesController from './databaseFiles.controller';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    TypeOrmModule.forFeature([User, Library, DatabaseFile]),
  ],
  controllers: [AuthController, DatabaseFilesController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    EmailService,
    AWSEmailService,
    LibraryService,
    DatabaseFilesService,
  ],
})
export class AuthModule {}
