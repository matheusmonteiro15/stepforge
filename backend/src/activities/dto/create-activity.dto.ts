import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  userId: string;
  
  @IsString()
  userName: string;
  
  @IsOptional()
  @IsString()
  userAvatar?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsNumber()
  likes?: number;
  
  @IsOptional()
  @IsString()
  groupId?: string;
}
