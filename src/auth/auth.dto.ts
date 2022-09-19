import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAuthDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
