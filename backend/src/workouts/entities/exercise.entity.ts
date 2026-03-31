import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workout } from './workout.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'int' })
  reps: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @ManyToOne(() => Workout, (workout) => workout.exercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column()
  workoutId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
