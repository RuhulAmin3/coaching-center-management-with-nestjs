import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(userId: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { studentId: userId },
          { teacherId: userId },
          { guardianId: userId },
        ],
      },
    });

    if (user && (await this.verifyPassword(user.password, password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  public async LoginUser(loginUserData: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { studentId: loginUserData.userId },
          { teacherId: loginUserData.userId },
          { guardianId: loginUserData.userId },
        ],
      },
    });
    if (!user) throw new NotFoundException('user not found');
    try {
      const checkPassword = await this.verifyPassword(
        user.password,
        loginUserData.password,
      );
      if (checkPassword) {
        const payload = {
          userId: user.id,
          role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
          accessToken,
          refreshToken,
          needPasswordChange: user.needPasswordChange,
        };
      } else {
        throw new UnauthorizedException('wrong credientials');
      }
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
    return isPasswordMatched;
  }
}
