import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from './exercise.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['planned', 'in_progress', 'completed'],
    default: 'planned',
  })
  status: string;

  @Column({ type: 'int', nullable: true, comment: 'Duration in minutes' })
  duration: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Exercise, (exercise) => exercise.workout, {
    cascade: true,
    eager: true,
  })
  exercises: Exercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
