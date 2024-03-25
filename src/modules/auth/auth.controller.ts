import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
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
  @UseGuards(LocalAuthGuard)
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
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() req: Request,
  ) {
    const { userId } = req.user;

    const result = await this.authService.updatePassword(
      userId,
      oldPassword,
      newPassword,
    );
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'password updated successfully',
    });
    return response;
  }
}
