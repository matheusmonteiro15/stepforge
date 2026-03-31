import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  membersCount?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
