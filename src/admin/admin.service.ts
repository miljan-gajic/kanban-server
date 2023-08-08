import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './../user/dto/user.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(role: Role): Promise<UserDto[]> {
    if (role === Role.ADMIN) {
      try {
        const allUsers = await this.prisma.user.findMany();

        const dtoUsersMap = allUsers.map((user) => new UserDto(user));

        return dtoUsersMap;
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error:
              'You do not have the necessary privileges to access this resource',
          },
          HttpStatus.FORBIDDEN,
          {
            cause: error,
          },
        );
      }
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: any) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
