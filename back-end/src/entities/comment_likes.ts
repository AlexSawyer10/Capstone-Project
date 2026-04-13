import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('COMMENT_LIKES')
export class CommentLikes {
  @PrimaryColumn({ name: 'COMMENT_ID' })
  commentId!: number;

  @PrimaryColumn({ name: 'USER_ID' })
  userId!: number;

  @Column({ name: 'IS_LIKED' })
  isLiked!: boolean;
  /*by default, we will say it's not liked.*/
}
