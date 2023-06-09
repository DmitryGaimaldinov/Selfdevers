import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { NotificationType, ParentType } from "./notification-enums";

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => User, (user) => user.notifications)
  @JoinTable()
  recipients: User[];

  /**
   * feedbackId - это id объекта, который нужен пользователю для уведомления.
   * Например, при событии подписки это подписавшийся пользователь.
   * При оставлении комментария - это комментарий.
   */
  @Column()
  feedbackId: number;

  /**
   * parentId - это id сущности, к которой применено событие.
   * Например, при лайке, это будет id лайкнутого поста.
   * При оставлении комментария - это пост, к которому он был оставлен.
   * Может быть null, например, при событии подписки.
   */
  @Column({ nullable: true })
  parentId: number;

  @CreateDateColumn()
  creationDate: Date;

  @Column({
    type: 'simple-enum',
    enum: NotificationType,
  })
  notificationType: NotificationType;

  @Column({
    type: 'simple-enum',
    enum: ParentType,
    nullable: true,
  })
  parentType: ParentType;
}
