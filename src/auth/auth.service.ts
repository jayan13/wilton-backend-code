import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AuthDto,
  ChangePasswordDto,
  CreateUserDto,
  ForgotPasswordDto,
  PaginationResponse,
  ResponseTokenDto,
  UpdateUserProfileByAdminDto,
  UpdateUserProfileDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, UpdateResult, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities';
import { AWSEmailService, EmailService } from 'src/email/email.service';
import { ResponseDto, generateRandomToken } from 'src/common';
import { ResponseStatus } from './auth.type';
import crypto from 'crypto';
import { LibraryService } from '../library/library.service';
import DatabaseFilesService from './databaseFiles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private sendGridService: EmailService,
    private sesService: AWSEmailService,
    private libraryService: LibraryService,
    private readonly databaseFilesService: DatabaseFilesService,
  ) {}

  async signin(authCredentialsDto: AuthDto): Promise<ResponseTokenDto> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('User not found.');
    const passMatch = await bcrypt.compare(password, user.password);
    if (!user.status) {
      throw new UnauthorizedException(
        'Your account has been suspended. Please contact administrator',
      );
    }
    if (user.isDeleted) {
      throw new UnauthorizedException(
        'Your account has been suspended. Please contact administrator',
      );
    }
    if (!passMatch) {
      throw new UnauthorizedException('password is incorrect');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signUp(createUserDto: CreateUserDto): Promise<ResponseDto> {
    const { fullName, email, status, libraries } = createUserDto;
    const salt = await bcrypt.genSalt();
    const token = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(token, salt);
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const expirationTime = Date.now() + 24 * 3600 * 1000;
    const resetPasswordExpires = new Date(expirationTime).toUTCString();
    const libraryList = await this.libraryService.getAllLibraries(libraries);

    try {
      // Save user to the database
      await this.userRepository.save({
        fullName,
        email,
        password: hashedPassword,
        resetPasswordToken,
        resetPasswordExpires,
        status,
        libraries: libraryList,
      });

      // HTML email body
      const resetLink = `${process.env.SEND_GRID_PASSWORD_RESET_LINK}?token=${resetPasswordToken}`;
      const emailBody = `
      <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; margin: 0; padding: 0; background-color: #f9f9f9;">
    <!-- Wrapper -->
    <div style="max-width: 600px; margin: 50px auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      
      <!-- Logo -->
      <div style="margin-bottom: 20px;">
        <img 
          src="https://wilton-assets.s3.ap-south-1.amazonaws.com/wilton-logo.png" 
          alt="Wilton Weavers Logo" 
          style="max-width: 200px; height: auto;"
        />
      </div>

      <!-- Greeting -->
      <h2 style="font-size: 24px; font-weight: normal; color: #333;">Hello ${fullName}</h2>

      <!-- Message -->
      <p style="font-size: 16px; color: #555; margin: 20px 0;">
        We have created an account for you. Start by setting your password.
      </p>
      <p style="font-size: 14px; color: #555; margin: 10px 0; font-weight: bold;">
        Protecting your data is important to us. <br>
        Please click on the button below to begin.
      </p>

      <!-- Button -->
      <p>
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 10px 30px;
            background-color: #D79963;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
      </p>

      <!-- Footer -->
      <p style="font-size: 14px; color: #888; margin-top: 20px;">Thank you,</p>
      <p style="font-size: 14px; color: #888;">Wilton</p>
    </div>
  </body>
</html>
      `;

      // Email message
      const emailMessage = {
        to: email,
        from: process.env.AWS_SES_FROM_EMAIL,
        subject: 'Welcome to Wilton Weaver',
        body: emailBody,
      };
      // Send email
      await this.sesService.sendEmail(emailMessage);

      return {
        status: ResponseStatus.SUCCESS,
        message: 'User registered and email sent successfully.',
      };
    } catch (err) {
      console.error('Error while creating user:', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  getProfile(id: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { id },
        select: [
          'fullName',
          'email',
          'createAt',
          'updatedAt',
          'id',
          'role',
          'logo',
          'status',
          'isDeleted',
          'avatarId',
        ],
        relations: ['libraries', 'avatar'],
      });
    } catch (err) {
      console.log('error', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async getAllProfile(
    offset: number,
    limit: number,
  ): Promise<PaginationResponse> {
    const skip = offset > 1 ? (offset - 1) * limit : 0;
    try {
      const [users, count] = await this.userRepository.findAndCount({
        skip: skip,
        take: limit,
        where: { isDeleted: false },
        select: [
          'fullName',
          'email',
          'createAt',
          'updatedAt',
          'id',
          'status',
          'isDeleted',
        ],
        relations: ['libraries'],
      });
      return { users, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async logout(userId: string): Promise<ResponseDto> {
    return this.userRepository
      .update({ id: userId, refreshToken: Not('null') }, { refreshToken: null })
      .then(() => {
        return {
          status: ResponseStatus.SUCCESS,
          message: 'Logout successfully...',
        };
      })
      .catch(() => {
        throw new InternalServerErrorException('Something bad happened');
      });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseDto> {
    const { email } = forgotPasswordDto;

    if (!email) {
      throw new UnprocessableEntityException('Email is required.');
    }

    // Check if the user exists
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    // Generate reset token and expiration time
    const resetPasswordToken = generateRandomToken();
    const expirationTime = Date.now() + 24 * 3600 * 1000; // 24 hours
    const resetPasswordExpires = new Date(expirationTime).toUTCString();

    // Save the token and expiration in the database
    try {
      await this.userRepository.update(user.id, {
        resetPasswordToken,
        resetPasswordExpires,
      });
    } catch (err) {
      console.error('Error while updating token and expiration date', err);
      throw new InternalServerErrorException('Something bad happened');
    }

    // Prepare the email content
    const emailTo = forgotPasswordDto.email;
    const resetLink = `${process.env.SEND_GRID_PASSWORD_RESET_LINK}?token=${resetPasswordToken}`;
    const subject = `You've requested a password reset from Wilton`;
    const body = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; margin: 0; padding: 0; background-color: #f9f9f9;">
    <!-- Wrapper -->
    <div style="max-width: 600px; margin: 50px auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      
      <!-- Logo -->
      <div style="margin-bottom: 20px;">
        <img 
          src="https://wilton-assets.s3.ap-south-1.amazonaws.com/wilton-logo.png" 
          alt="Wilton Weavers Logo" 
          style="max-width: 200px; height: auto;"
        />
      </div>

      <!-- Greeting -->
      <h2 style="font-size: 24px; font-weight: normal; color: #333;">Hello ${user?.fullName}</h2>

      <!-- Message -->
      <p style="font-size: 16px; color: #555; margin: 20px 0;">
        We received a request to reset your Wilton password.
      </p>
      <p style="font-size: 14px; color: #555; margin: 10px 0; font-weight: bold;">
        Protecting your data is important to us. <br>
        Please click on the button below to begin.
      </p>

      <!-- Button -->
      <p>
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 10px 30px;
            background-color: #D79963;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
      </p>

      <!-- Footer -->
      <p style="font-size: 14px; color: #888; margin-top: 20px;">Thank you,</p>
      <p style="font-size: 14px; color: #888;">Wilton</p>
    </div>
  </body>
</html>
    `;

    // Use AWS SES to send the email
    const emailMessage = {
      to: emailTo,
      from: process.env.AWS_SES_FROM_EMAIL,
      subject: subject,
      body: body,
    };

    try {
      await this.sesService.sendEmail(emailMessage); // Use your AWS SES service here
      return {
        status: ResponseStatus.SUCCESS,
        message: 'Password reset email sent successfully.',
      };
    } catch (err) {
      console.error('Error while sending email', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async verifyPasswordToken(resetPasswordToken: string): Promise<ResponseDto> {
    try {
      // find token and token expiration time
      const verifyToken = await this.userRepository.findOneBy({
        resetPasswordToken,
        resetPasswordExpires: MoreThan(new Date()),
      });

      // check token is exists
      if (!verifyToken) {
        return {
          status: ResponseStatus.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: 'Password reset token is invalid or has expired.',
        };
      } else {
        return {
          status: ResponseStatus.SUCCESS,
          code: HttpStatus.OK,
          message: `Token validated for ${verifyToken.email}`,
        };
      }
    } catch (err) {
      console.log('error while fetch user token', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    try {
      const { password, resetPasswordToken } = changePasswordDto;
      if (!password)
        throw new UnprocessableEntityException('Password is required');

      // find token and token expiration time
      const user = await this.userRepository.findOneBy({
        resetPasswordToken,
        resetPasswordExpires: MoreThan(new Date()),
      });

      // check token is exists
      if (!user) {
        return {
          status: ResponseStatus.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: 'Password reset token is invalid or has expired.',
        };
      }

      // bcrypt new password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(hashedPassword, 'hashh');
      // update new changed password
      return this.userRepository
        .update(user.id, { password: hashedPassword })
        .then(async () => {
          await this.userRepository.update(user.id, {
            resetPasswordToken: null,
            resetPasswordExpires: null,
          });
          return {
            status: ResponseStatus.SUCCESS,
            message: 'password changed successfully.',
          };
        })
        .catch(() => {
          throw new InternalServerErrorException('Something bad happened');
        });
    } catch (err) {
      console.log('err while update new password', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async updateProfile(
    id: string,
    updateUserProfile: UpdateUserProfileDto,
  ): Promise<ResponseDto> {
    const password = updateUserProfile?.password;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found.');
    if (password) {
      const salt = await bcrypt.genSalt();
      updateUserProfile.password = await bcrypt.hash(password, salt);
    }
    try {
      await this.userRepository.update(id, updateUserProfile);
      return {
        status: ResponseStatus.SUCCESS,
      };
    } catch (err) {
      console.log(`Something went wrong`, err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateUserProfileByAdmin(
    id: string,
    updateUserProfile: UpdateUserProfileByAdminDto,
  ): Promise<ResponseDto> {
    const { userId, password, libraries } = updateUserProfile;
    // console.log("password",password)
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found.');
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      // console.log(hashedPassword,"hashedpass")
      updateUserProfile.password = hashedPassword;
    }
    if (libraries && libraries.length) {
      const libraryList = await this.libraryService.getAllLibraries(libraries);
      updateUserProfile.libraries = libraryList;
    }
    try {
      let updatedEmail = user.email;
      if (updateUserProfile.isDeleted) {
        updatedEmail = `deletedAt-${new Date().toISOString()}-${user.email}`;
      }
      // console.log('updateUserProfile',updateUserProfile)
      await this.userRepository.save({
        id: userId,
        email: updatedEmail,
        ...updateUserProfile,
      });
      return {
        status: ResponseStatus.SUCCESS,
      };
    } catch (err) {
      console.log(`Something went wrong`, err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UpdateResult> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(refreshToken, salt);
    return this.userRepository.update(userId, { refreshToken: hash });
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<ResponseTokenDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            id: userId,
            email,
            role: role,
          },
          {
            secret: process.env.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
          },
        ),
        this.jwtService.signAsync(
          {
            id: userId,
            email,
            role: role,
          },
          {
            secret: process.env.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
          },
        ),
      ]);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (err) {
      console.log('error while get tokens', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async refreshTokens(
    id: string,
    refreshToken: string,
  ): Promise<ResponseTokenDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, 'user');
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    const avatar = await this.databaseFilesService.uploadDatabaseFile(
      imageBuffer,
      filename,
    );
    await this.userRepository.update(userId, {
      avatarId: avatar.id,
    });
    return avatar;
  }
}
