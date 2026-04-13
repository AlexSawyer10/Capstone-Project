import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('LIST_GAME')
export class ListGame {
  @PrimaryColumn({ name: 'GAME_ID', type: 'int' })
  gameId!: number;

  @PrimaryColumn({ name: 'LIST_ID', type: 'int' })
  listId!: number;

  @Column({ name: 'LIST_GAME_RANK', type: 'int', nullable: true })
  listGameRank!: number | null;

  @Column({ name: 'LIST_GAME_STATUS', type: 'varchar', nullable: true })
  listGameStatus!: 'completed' | 'playing' | 'wishlist' | null;
}
