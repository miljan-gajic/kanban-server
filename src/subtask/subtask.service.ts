import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubtaskDto } from './dto';

@Injectable()
export class SubtaskService {
  constructor(private prisma: PrismaService) {}

  async createSubtask(dto: CreateSubtaskDto, taskId: number, userId: number) {
    const existingSubtask = await this.prisma.subtask.findFirst({
      where: {
        AND: [
          {
            title: dto.title,
          },
          {
            taskId: taskId,
          },
        ],
      },
    });

    const existingHostTask = await this.retrieveTheHostTask(taskId, userId);

    if (existingSubtask)
      throw new BadRequestException(
        'The subtask already exist, please update the existing subtask',
      );

    try {
      if (
        existingHostTask &&
        !existingSubtask &&
        existingHostTask.autherId === userId
      ) {
        const subtask = await this.prisma.subtask.create({
          data: {
            title: dto.title,
            description: dto.description,
            status: dto.status,
            taskId: Number(taskId),
          },
        });

        return {
          subtask,
        };
      } else {
        throw new NotFoundException(
          'The task you want to add the subtask to, does not exist',
        );
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken, please try with different credentials',
          );
        }
      }
      throw error;
    }
  }

  async updateSubtask(
    taskId: number,
    updateSubtaskDto: Partial<CreateSubtaskDto>,
    subtaskId: number,
    userId: number,
  ) {
    const existingSubtask = await this.retrieveSubtaskById(subtaskId, taskId);

    if (!existingSubtask)
      throw new BadRequestException(
        'The subtask you wish to update does not exist',
      );

    const existingHostTask = await this.retrieveTheHostTask(taskId, userId);

    try {
      if (existingHostTask && existingHostTask.id === existingSubtask.taskId) {
        await this.prisma.subtask.updateMany({
          where: {
            AND: [
              {
                id: subtaskId,
              },
              {
                taskId,
              },
            ],
          },
          data: {
            title: updateSubtaskDto.title ?? existingSubtask.title,
            description:
              updateSubtaskDto.description ?? existingSubtask.description,
            status: updateSubtaskDto.status ?? existingSubtask.status,
          },
        });

        const updatedSubtask = await this.retrieveSubtaskById(
          subtaskId,
          taskId,
        );

        return {
          subtask: updatedSubtask,
        };
      } else {
        throw new NotFoundException('The subtask does not exist');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException(
          'Could not update the status of the subtask, please try again later',
        );
      }
    }
  }

  async updateSubtaskStatus(
    taskId: number,
    subtaskId: number,
    userId: number,
    status: Status,
  ) {
    const existingHostTask = await this.retrieveTheHostTask(taskId, userId);
    const existingSubtask = await this.retrieveSubtaskById(subtaskId, taskId);

    if (!existingHostTask) {
      throw new BadRequestException(
        'There is no requested subtask for this user',
      );
    }

    if (existingHostTask && existingHostTask.id === existingSubtask.taskId) {
      await this.prisma.subtask.updateMany({
        where: {
          AND: [
            {
              id: subtaskId,
            },
            {
              taskId,
            },
          ],
        },
        data: {
          status,
        },
      });

      const updatedSubtask = await this.retrieveSubtaskById(subtaskId, taskId);

      return {
        subtask: updatedSubtask,
      };
    } else {
      throw new NotFoundException('The subtask does not exist');
    }
  }

  async removeSubtask(taskId: number, subtaskId: number, userId: number) {
    const existingHostTask = await this.retrieveTheHostTask(taskId, userId);
    const existingSubtask = await this.retrieveSubtaskById(subtaskId, taskId);

    if (existingHostTask && existingHostTask.id === existingSubtask.taskId) {
      const deletedSubtask = await this.removeTheSubtaskById(subtaskId, taskId);

      if (!deletedSubtask || !deletedSubtask.count)
        throw new BadRequestException(
          'The subtask that was meant to be deleted was not found',
        );
      return {
        deleted: `Successfully deleted - ${deletedSubtask.count}`,
      };
    } else {
      throw new NotFoundException('The subtask does not exist');
    }
  }

  // Util methods

  async retrieveSubtaskById(subtaskId: number, taskId: number) {
    const existingSubtask = await this.prisma.subtask.findFirst({
      where: {
        AND: [
          {
            id: subtaskId,
          },
          {
            taskId,
          },
        ],
      },
    });

    return existingSubtask;
  }

  async removeTheSubtaskById(subtaskId: number, taskId: number) {
    const deletedTask = await this.prisma.subtask.deleteMany({
      where: {
        AND: [
          {
            id: subtaskId,
          },
          {
            taskId,
          },
        ],
      },
    });

    return deletedTask;
  }

  async retrieveTheHostTask(taskId: number, userId: number) {
    const existingHostTask = await this.prisma.task.findFirst({
      where: {
        AND: [
          {
            id: taskId,
          },
          {
            autherId: userId,
          },
        ],
      },
    });

    return existingHostTask;
  }
}
