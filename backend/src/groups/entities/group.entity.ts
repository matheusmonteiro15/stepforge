import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0 })
  membersCount: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
