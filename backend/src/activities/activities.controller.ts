import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll(@Query('groupId') groupId?: string) {
    return this.activitiesService.findAll(groupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
