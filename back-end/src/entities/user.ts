import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn({ name: 'USER_ID' })
  userId!: number;

  @Column({ name: 'USER_PROVIDER_ID', length: 255 })
  userProviderId!: string;

  @Column({ name: 'USER_EMAIL' })
  userEmail!: string;

  @Column({ name: 'NAME' })
  name!: string;

  @Column({ name: 'USER_PICTURE' })
  userPicture!: string;

}
