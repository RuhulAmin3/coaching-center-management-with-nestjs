import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/login')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  loginUser(@Body() loginUserData: LoginUserDto) {
    return this.authService.LoginUser(loginUserData);
  }
}
