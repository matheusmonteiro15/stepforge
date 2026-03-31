import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;
  
  @Column()
  userName: string;
  
  @Column({ nullable: true })
  userAvatar: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 0 })
  likes: number;
  
  @Column({ nullable: true })
  groupId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
