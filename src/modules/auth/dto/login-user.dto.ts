import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}

export class ForgotPasswordDTO {
  @IsNotEmpty({ message: 'id cannot be empty' })
  id: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsNotEmpty({ message: 'new password cannot be empty' })
  newPassword: string;
}

export class UpdatePasswordDTO {
  @IsNotEmpty({ message: 'old password cannot be empty' })
  oldPassword: string;

  @IsNotEmpty({ message: 'new password cannot be empty' })
  newPassword: string;
}
