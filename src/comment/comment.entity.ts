import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: true, default: null })
  parent_id: number | null;

  @Column({ type: 'int' })
  tred_id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'text' })
  comment_text: string;

  @Column({ type: 'text', nullable: true })
  file_path: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;
}
