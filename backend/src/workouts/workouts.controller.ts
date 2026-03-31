import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Request() req, @Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(req.user.sub, createWorkoutDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.workoutsService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.workoutsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, req.user.sub, updateWorkoutDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.workoutsService.remove(id, req.user.sub);
  }
}
