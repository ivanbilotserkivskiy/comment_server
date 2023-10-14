import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async findAll(filter, query?): Promise<CommentEntity[] | string> {
    let sortBy = 'created';
    let order = 'DESC';
    const perPage = 25;
    let page = 1;

    if (query && query.page) {
      page = +query.page;
    }

    const offset = (page - 1) * perPage;

    if (query && query.sortBy && query.order) {
      sortBy = query.sortBy;
      order = query.order;
    }

    if (query && query.page) {
      try {
        const data = await this.commentRepository.find({
          order: {
            [sortBy]: order,
          },
          skip: offset,
          take: perPage,
          where: filter,
        });
        return data;
      } catch {
        return 'Can not get data';
      }
    } else {
      try {
        const data = await this.commentRepository.find({
          order: {
            [sortBy]: order,
          },
          where: filter,
        });
        return data;
      } catch {
        return 'Can not get data';
      }
    }
  }

  async findByTredId(tred_id: string): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: {
        tred_id: +tred_id,
      },
      order: {
        created: 'DESC',
      },
    });
  }

  async add(comment): Promise<CommentEntity | string> {
    try {
      const { parent_id, comment_text, file_path, username, email, tred_id } =
        comment;
      const data = await this.commentRepository.save({
        parent_id,
        tred_id,
        comment_text,
        file_path,
        username,
        email,
      });
      return data;
    } catch (error) {
      return 'can not create comment';
    }
  }

  async countTotal(): Promise<number | string> {
    try {
      const total = await this.commentRepository.count({
        where: {
          parent_id: IsNull(),
        },
      });

      return total;
    } catch {
      return 'cant count main coments';
    }
  }

  async findMaxTredId(): Promise<number | string> {
    try {
      let maxTredId = await this.commentRepository.maximum('tred_id');
      return maxTredId ? ++maxTredId : 1;
    } catch {
      return 'can not find max tred Id';
    }
  }
}
