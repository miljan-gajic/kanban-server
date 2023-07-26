import { CreateTaskDto } from '../dto/create-task.dto';

export type UpdateTaskPayload = Partial<CreateTaskDto> & { taskId: number };
