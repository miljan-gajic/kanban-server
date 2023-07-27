import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskPayload } from './types/task.types';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto, userId: number) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        AND: [
          {
            title: dto.title,
          },
          {
            autherId: userId,
          },
        ],
      },
    });

    if (existingTask)
      throw new BadRequestException(
        'The Task already exist, please update the existing task',
      );

    try {
      const task = await this.prisma.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          autherId: userId,
        },
      });

      return {
        task,
      };
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

  async getAllTasksForUser(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        autherId: userId,
      },
      include: {
        subtasks: true,
      },
    });

    if (!tasks)
      throw new BadRequestException('There are no tasks for this user');

    const sortedTasks = tasks.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    return {
      tasks: sortedTasks,
    };
  }

  async getSingleTask(taskId: string, userId: number) {
    const existingTask = await this.retrieveTheTaskById(taskId, userId);

    if (!existingTask)
      throw new BadRequestException(
        'There is no task for this user or with the provided task id',
      );

    return {
      task: existingTask,
    };
  }

  async updateTask(dto: UpdateTaskPayload, taskId: string, userId: number) {
    const existingTask = await this.retrieveTheTaskById(taskId, userId);

    if (!existingTask) {
      throw new BadRequestException(
        'There are no requested tasks for this user',
      );
    }

    await this.prisma.task.updateMany({
      where: {
        AND: [
          {
            id: Number(taskId),
          },
          {
            autherId: userId,
          },
        ],
      },
      data: {
        title: dto.title ?? existingTask.title,
        description: dto.description ?? existingTask.description,
        status: dto.status ?? existingTask.status,
      },
    });

    const updatedTask = await this.retrieveTheTaskById(taskId, userId);

    return {
      task: updatedTask,
    };
  }

  async updateTaskStatus(taskId: string, status: Status, userId: number) {
    const existingTask = await this.retrieveTheTaskById(taskId, userId);

    if (!existingTask) {
      throw new BadRequestException('There are no tasks for this user');
    }

    try {
      await this.prisma.task.updateMany({
        where: {
          AND: [
            {
              id: Number(taskId),
            },
            {
              autherId: userId,
            },
          ],
        },
        data: {
          status,
        },
      });

      const patchedTask = await this.retrieveTheTaskById(taskId, userId);

      return {
        task: patchedTask,
      };
    } catch (error) {
      throw new BadRequestException(
        'Could not update the status of the task, please try again later',
      );
    }
  }

  async deleteTask(taskId: string, userId: number) {
    const deletedTask = await this.removeTheTaskById(taskId, userId);

    if (!deletedTask || !deletedTask.count)
      throw new BadRequestException(
        'The Task that was meant to be deleted was not found',
      );

    return {
      deleted: `Successfully deleted - ${deletedTask.count}`,
    };
  }

  // Util methods

  async retrieveTheTaskById(taskId: string, userId?: number) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        AND: [
          {
            id: typeof taskId === 'string' ? Number(taskId) : taskId,
          },
          {
            autherId: userId,
          },
        ],
      },
      include: {
        subtasks: true,
      },
    });

    return existingTask;
  }

  async removeTheTaskById(taskId: string, userId: number) {
    const deletedTask = await this.prisma.task.deleteMany({
      where: {
        AND: [
          {
            id: typeof taskId === 'string' ? Number(taskId) : taskId,
          },
          {
            autherId: userId,
          },
        ],
      },
    });

    return deletedTask;
  }
}
