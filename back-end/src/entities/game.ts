import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('GAME')
export class Game {
  @PrimaryColumn({ name: 'GAME_ID', type: 'int' })
  gameId!: number;

  @Column({ name: 'GAME_NAME', type: 'varchar' })
  gameName!: string;

  @Column({ name: 'GAME_RELEASED', type: 'varchar', nullable: true })
  gameReleased!: string | null;

  @Column({ name: 'GAME_DESCRIPTION', type: 'text', nullable: true })
  gameDescription!: string | null;

  @Column({ name: 'GAME_IMAGE', type: 'varchar', nullable: true })
  gameImage!: string | null;
}
