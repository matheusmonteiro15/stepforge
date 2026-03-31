import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
