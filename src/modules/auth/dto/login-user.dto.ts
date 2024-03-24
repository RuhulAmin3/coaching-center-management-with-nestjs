import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
