import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'src/common/erros/types/NotFoundError';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createPostDto: CreatePostDto): Promise<Post> {
    const { authorEmail } = createPostDto;

    delete createPostDto.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const data: Prisma.PostCreateInput = {
      ...createPostDto,
      author: { connect: { email: authorEmail } },
    };

    const post = await this.prisma.post.create({
      data,
    });

    return post;
  }

  public async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  public async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const postUpdate = await this.prisma.post.update({
      data: updatePostDto,
      where: {
        id,
      },
    });

    return postUpdate;
  }

  public async remove(id: number) {
    await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
