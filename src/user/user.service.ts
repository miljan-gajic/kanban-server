import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        tasks: true,
      },
    });

    if (!user)
      throw new NotFoundException('The user you requested does not exist');

    delete user.hash;

    return user;
  }
}
