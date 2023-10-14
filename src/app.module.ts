import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { CommentEntity } from './comment/comment.entity';
import { CommentModule } from './comment/comment.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../', '.env'),
      isGlobal: true,
    }),
    MulterModule.register({ dest: './files' }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../', 'files'),
      serveRoot: '/files',
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [CommentEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CommentModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
