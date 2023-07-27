import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { SubtaskService } from './subtask.service';

@Controller('task/subtask')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Post('/:taskId')
  createSubtask(
    @Body() createSubtaskDto: CreateSubtaskDto,
    @Param('taskId') taskId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.subtaskService.createSubtask(createSubtaskDto, +taskId, userId);
  }

  @Put('/:taskId')
  updateSubtask(
    @Param('taskId') taskId: string,
    @Body() updateSubtaskDto: Partial<CreateSubtaskDto>,
    @Query('subtask') subtaskId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.subtaskService.updateSubtask(
      +taskId,
      updateSubtaskDto,
      +subtaskId,
      userId,
    );
  }

  @Patch('/:taskId')
  updateSubtaskStatus(
    @Param('taskId') taskId: string,
    @GetUser('userId') userId: number,
    @Query('subtask') subtaskId: string,
    @Query('status') status: Status,
  ) {
    return this.subtaskService.updateSubtaskStatus(
      +taskId,
      +subtaskId,
      userId,
      status,
    );
  }

  @Delete('/:taskId')
  removeSubtask(
    @Param('taskId') taskId: string,
    @Query('subtask') subtaskId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.subtaskService.removeSubtask(+taskId, +subtaskId, userId);
  }
}
