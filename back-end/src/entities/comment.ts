import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('COMMENT')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'COMMENT_ID', type: 'int', })
      /*so there's a difference between primary generated column and primary column. Generated column auto produces you a new PK in the database
      * primary column does not. */
  commentId!: number;

  @Column({ name: 'USER_ID' })
  userId!: number;

  @Column({ name: 'LIST_ID' })
  listId!: number;

  @Column({ name: 'COMMENT_DESCRIPTION' })
  commentDescription!: string;

  @Column({ name: 'COMMENT_LIKES', default: 0 })
  commentLikes!: number;

  @Column({ name: 'COMMENT_DISLIKES', default: 0 })
  commentDislikes!: number;

  /*once a comment is posted it will be given 0 likes and 0 dislikes*/
}
