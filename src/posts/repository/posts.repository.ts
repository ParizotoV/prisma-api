import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });

    return post;
  }

  public async findAll(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();

    return posts;
  }

  public async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
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
