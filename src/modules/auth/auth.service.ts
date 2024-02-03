import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  public async LoginUser(loginUserData: LoginUserDto) {
    try {
      await this.verifyPassword('sadflsdf', loginUserData.password);
    } catch (error) {
      throw error;
    }
  }

  private async verifyPassword(hashedPassword: string, textPassword: string) {
    const isPasswordMatched = await bcrypt.compare(
      textPassword,
      hashedPassword,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('wrong crediential provided');
    }
  }
}
