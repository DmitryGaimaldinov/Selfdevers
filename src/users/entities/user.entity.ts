import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, JoinTable,
  ManyToMany, ManyToOne,
  OneToMany, OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { Exclude } from "class-transformer";
import { Following } from "../../followings/entities/following.entity";
import { Note } from "../../notes/entities/note.entity";
import { ImageEntity } from "../../photos/enitities/image.entity";
import { NotificationEntity } from "../../notifications/entities/nofitication.entity";

// export enum UserRole {
//   USUAL = 'usual',
//   ADMIN = 'admin',
// }

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Exclude()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  userTag: string;

  @Column({ default: '' })
  description: string;

  @CreateDateColumn()
  registerDate: Date;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn()
  avatar: ImageEntity;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn()
  background: ImageEntity;

  @Column({ default: false })
  isPrivate: boolean;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(type => Note, note => note.creator)
  notes: Note[];

  @ManyToMany(() => NotificationEntity, (notification) => notification.recipients)
  notifications: NotificationEntity[];

  // counters?: UserCounters;

  // @Column({
  //   type: "enum",
  //   enum: UserRole,
  //   default: UserRole.USUAL,
  // })
  // role: UserRole;

  // drafts: Post[];
}

// export type UserCounters = Map<UserCounterType, number>;
//
// export enum UserCounterType {
//   followers = 'followers',
//   followings = 'followings',
//   posts = 'posts',
// }
