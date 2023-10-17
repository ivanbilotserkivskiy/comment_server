import { In, IsNull } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { customFileValidator } from 'src/utils/customFileValidator';
import { validation } from 'src/utils/validation';
import { cleanHTML } from 'src/utils/sanitize';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(@Query() query): Promise<CommentEntity[] | string> {
    const mainComments = await this.commentService.findAll(
      {
        parent_id: IsNull(),
      },
      query,
    );

    if (typeof mainComments === 'string') {
      return mainComments;
    }

    const tredIds = mainComments.map((comment) => comment.tred_id);

    const comentsByTred = await this.commentService.findAll({
      tred_id: In(tredIds),
    });

    if (typeof comentsByTred === 'string') {
      return comentsByTred;
    }

    const getChildren = (children: CommentEntity[]) => {
      const nextChildren = children.map((child) => {
        const data = comentsByTred.filter(
          (comment) => comment.parent_id === child.id,
        );
        const nextData = getChildren(data);

        return {
          ...child,
          children: nextData,
        };
      });

      return nextChildren;
    };

    const commentsData = getChildren(mainComments);

    return commentsData;
  }

  @Get('/total')
  async findTotal() {
    return this.commentService.countTotal();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { fileFilter: customFileValidator }))
  async add(
    @Body() comment: CommentEntity,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    file?: Express.Multer.File,
  ): Promise<CommentEntity | string> {
    const { parent_id, comment_text, username, email, tred_id } = comment;
    const error = validation({
      comment_text,
      username,
      email,
      parent_id,
      tred_id,
    });

    if (error) {
      return error;
    }

    const cleanCommentText = cleanHTML(comment_text);

    let dbfilename = null;
    let fileBuffer = null;
    let fileName = '';
    let mimetype = '';
    if (file) {
      mimetype = file.mimetype;
      dbfilename = `${file.filename}`;
      fileBuffer = file.buffer;
      fileName = file.originalname;
    }

    const parentId = parent_id ? +parent_id : null;
    const tredId = tred_id
      ? +tred_id
      : await this.commentService.findMaxTredId();

    const newComment = await this.commentService.add(
      {
        parent_id: parentId,
        tred_id: tredId,
        comment_text: cleanCommentText,
        file_path: dbfilename,
        username,
        email,
      },
      fileBuffer,
      fileName,
      mimetype,
    );

    return newComment;
  }
}
