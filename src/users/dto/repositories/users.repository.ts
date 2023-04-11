import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExist = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExist) {
      throw new UnauthorizedException(
        `There is already a user created with the email ${createUserDto.email}`,
      );
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return user;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  public async findOne(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }
    return user;
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return updateUser;
  }

  public async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
