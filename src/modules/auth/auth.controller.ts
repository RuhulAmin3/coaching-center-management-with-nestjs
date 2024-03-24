import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorator/public.decorator';

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
      maxAge: 1 * 60 * 1000, // 1 min
    });
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });
    return response;
  }
}
