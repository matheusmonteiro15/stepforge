import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const activity = this.activitiesRepository.create(createActivityDto);
    return this.activitiesRepository.save(activity);
  }

  findAll(groupId?: string) {
    const query = this.activitiesRepository.createQueryBuilder('activity')
      .orderBy('activity.createdAt', 'DESC');
      
    if (groupId) {
      query.where('activity.groupId = :groupId', { groupId });
    }
    
    return query.getMany();
  }

  async findOne(id: string) {
    const activity = await this.activitiesRepository.findOne({ where: { id } });
    if (!activity) throw new NotFoundException('Atividade não encontrada');
    return activity;
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    const activity = await this.findOne(id);
    this.activitiesRepository.merge(activity, updateActivityDto);
    return this.activitiesRepository.save(activity);
  }

  async remove(id: string) {
    const activity = await this.findOne(id);
    return this.activitiesRepository.remove(activity);
  }
}
