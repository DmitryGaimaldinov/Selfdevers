import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class NotificationsReadingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @UpdateDateColumn()
  lastViewed: Date;
}