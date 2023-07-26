import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/create_task')
  createTask(@Body() dto: CreateTaskDto, @GetUser('userId') userId: number) {
    return this.taskService.createTask(dto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/tasks')
  getAllTasksForUser(@GetUser('userId') userId: number) {
    return this.taskService.getAllTasksForUser(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/task/:id')
  getSingleTask(
    @Param('id') taskId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.taskService.getSingleTask(taskId, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/edit_task/:id')
  updateTask(
    @Body() dto: CreateTaskDto,
    @Param('id') taskId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.taskService.updateTask(dto, taskId, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/update_status/:id')
  updateTaskStatus(
    @Param('id') taskId: string,
    @Query('status') status: Status,
    @GetUser('userId') userId: number,
  ) {
    return this.taskService.updateTaskStatus(taskId, status, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/task/:id')
  deleteTask(@Param('id') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
