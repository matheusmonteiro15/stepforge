import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepository: Repository<Workout>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(
    userId: string,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<Workout> {
    const { exercises, ...workoutData } = createWorkoutDto;

    const workout = this.workoutsRepository.create({
      ...workoutData,
      userId,
      exercises: exercises, // Cascade option in entity will save these too
    });

    return this.workoutsRepository.save(workout);
  }

  async findAllByUser(userId: string): Promise<Workout[]> {
    return this.workoutsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['exercises'],
    });
  }

  async findOne(id: string, userId: string): Promise<Workout> {
    const workout = await this.workoutsRepository.findOne({
      where: { id, userId },
      relations: ['exercises'],
    });

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }

    return workout;
  }

  async update(
    id: string,
    userId: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const workout = await this.findOne(id, userId);

    Object.assign(workout, updateWorkoutDto);
    return this.workoutsRepository.save(workout);
  }

  async remove(id: string, userId: string): Promise<void> {
    const workout = await this.findOne(id, userId);
    await this.workoutsRepository.remove(workout);
  }
}
