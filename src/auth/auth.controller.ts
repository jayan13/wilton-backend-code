import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetCurrentUserId, Public } from '../common/decorator';
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
import { PaginationParams, ResponseDto } from 'src/common';
import { JwtAuthGuard } from 'src/common/guards';
import { QueryStringToken } from './auth.type';
import { FileInterceptor } from '@nestjs/platform-express';
// import { User } from './entities';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('avatar/:id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(file,"file")
    // const imageBuffer = Buffer.from(file.originalname, 'base64');
    // console.log('imageBuffer', imageBuffer)
    return this.authService.addAvatar(id, file.buffer, file.originalname);
  }

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signin(@Body() authCredentialsDto: AuthDto): Promise<ResponseTokenDto> {
    return this.authService.signin(authCredentialsDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@GetCurrentUserId() userId: string): Promise<ResponseDto> {
    return this.authService.logout(userId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/reset-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/verify')
  verifyPasswordToken(
    @Body() { token }: QueryStringToken,
  ): Promise<ResponseDto> {
    return this.authService.verifyPasswordToken(token);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    return this.authService.changePassword(changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user-profile')
  updateProfile(
    @GetCurrentUserId() userId: string,
    @Body() updateUserProfile: UpdateUserProfileDto,
  ): Promise<ResponseDto> {
    return this.authService.updateProfile(userId, updateUserProfile);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/profile/me')
  getMyProfile(@GetCurrentUserId() userId: string): Promise<CreateUserDto> {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/admin/update-profile')
  updateUserProfileByAdmin(
    @GetCurrentUserId() adminId: string,
    @Body() updateUserProfile: UpdateUserProfileByAdminDto,
  ): Promise<ResponseDto> {
    return this.authService.updateUserProfileByAdmin(
      adminId,
      updateUserProfile,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/profile/:id')
  getProfile(@Param('id') id: string): Promise<CreateUserDto> {
    return this.authService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/profiles')
  getAllProfile(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<PaginationResponse> {
    return this.authService.getAllProfile(offset, limit);
  }
}
