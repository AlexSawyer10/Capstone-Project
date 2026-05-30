import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('LIST_LIKES')
export class ListLikes {
  @PrimaryGeneratedColumn({ name: 'LIKE_ID' })
  likeId!: number;

  @Column({ name: 'USER_ID', type: 'int' })
  userId!: number;

  @Column({ name: 'LIST_ID', type: 'int' })
  listId!: number;

  @Column({ name: 'IS_LIKED', type: 'boolean', nullable: true })
  isLiked!: boolean | null;
}
