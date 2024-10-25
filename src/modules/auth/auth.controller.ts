import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import {
  ForgotPasswordDTO,
  LoginUserDto,
  ResetPasswordDTO,
  UpdatePasswordDTO,
} from './dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
// import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorator/public.decorator';
import { HasRoles } from './decorator/roles.decorator';
import { ROLE } from '@prisma/client';
import { apiResponse } from 'src/utils/api-response';

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  // @UseGuards(LocalAuthGuard)
  async loginUser(
    @Body() loginUserData: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.LoginUser(loginUserData);
    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'none',
      maxAge: 7 * 60 * 1000, // 7 min
    });
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });
    return response;
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const result = await this.authService.refreshToken(refreshToken);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'none',
      maxAge: 1 * 60 * 1000, // 1 min
    });
    return result;
  }

  @Post('/update-password')
  @HasRoles(ROLE.ADMIN, ROLE.GUARDIAN, ROLE.STUDENT, ROLE.TEACHER)
  async updatePassword(
    @Body() data: UpdatePasswordDTO,
    @Req()
    req: Request,
  ) {
    const { userId } = req.user;

    const result = await this.authService.updatePassword(
      userId,
      data.oldPassword,
      data.newPassword,
    );
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'password updated successfully',
    });
    return response;
  }
  @Post('/forgot-password')
  @Public()
  async forgotPassword(@Body() data: ForgotPasswordDTO) {
    await this.authService.forgotPassword(data.id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message: 'Check your email to get the reset link',
    });
    return response;
  }

  @Post('/reset-password')
  @Public()
  async resetPassword(@Body() data: ResetPasswordDTO, @Req() req: Request) {
    const token = req.headers.authorization || '';
    await this.authService.resetPassword(data.userId, data.newPassword, token);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message:
        'Password reset successfully. Now you can login with your new password',
    });
    return response;
  }
}
