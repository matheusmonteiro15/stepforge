import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  sets: number;

  @IsNumber()
  reps: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['planned', 'in_progress', 'completed'])
  @IsOptional()
  status?: string = 'planned';

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}
