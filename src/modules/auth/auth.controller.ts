import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  loginUser(@Body() loginUserData: LoginUserDto) {
    return this.authService.LoginUser(loginUserData);
  }
}
