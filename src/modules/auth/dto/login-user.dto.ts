import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Id cannot be empty' })
  id: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
