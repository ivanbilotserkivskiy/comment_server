import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { IsNull, Repository } from 'typeorm';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
    },
  });
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly configService: ConfigService,
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

  async add(
    comment,
    file,
    fileName: string,
    mimetype,
  ): Promise<CommentEntity | string> {
    if (file) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('BUCKET'),
          Key: fileName,
          Body: file,
          ContentType: mimetype,
        }),
      );
    }
    const region = this.configService.getOrThrow('AWS_S3_REGION');
    try {
      const { parent_id, comment_text, username, email, tred_id } = comment;
      const data = await this.commentRepository.save({
        parent_id,
        tred_id,
        comment_text,
        file_path: `https://coll-bucket.s3.${region}.amazonaws.com/${fileName}`,
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
