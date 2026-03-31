import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDto } from './create-workout.dto';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['planned', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
