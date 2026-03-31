import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { Workout } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, Exercise]),
    forwardRef(() => AuthModule),
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
