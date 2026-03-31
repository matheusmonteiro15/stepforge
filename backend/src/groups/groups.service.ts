import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto & { ownerId?: string }) {
    const group = this.groupsRepository.create(createGroupDto);
    return this.groupsRepository.save(group);
  }

  findAll() {
    return this.groupsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const group = await this.groupsRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Grupo não encontrado');
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(id);
    this.groupsRepository.merge(group, updateGroupDto);
    return this.groupsRepository.save(group);
  }

  async remove(id: string) {
    const group = await this.findOne(id);
    return this.groupsRepository.remove(group);
  }
}
