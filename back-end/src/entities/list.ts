import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('LIST')
export class List {
  @PrimaryGeneratedColumn({ name: 'LIST_ID' })
  listId!: number;

  @Column({ name: 'USER_ID', type: 'int' })
  userId!: number;

  @Column({ name: 'LIST_NAME', type: 'varchar' })
  listName!: string;

  @Column({ name: 'LIST_DESCRIPTION', type: 'text', nullable: true })
  listDescription!: string | null;

  @Column({ name: 'LIST_IMAGE', type: 'varchar', nullable: true })
  listImage!: string | null;

  @Column({ name: 'PUBLIC', type: 'boolean', default: true })
  public!: boolean;

  @Column({ name: 'LIST_LIKES', type: 'int', default: 0 })
  listLikes!: number;

  @Column({ name: 'LIST_DISLIKES', type: 'int', default: 0 })
  listDislikes!: number;
}
