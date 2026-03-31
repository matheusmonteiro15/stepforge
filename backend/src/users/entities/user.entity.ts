import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
