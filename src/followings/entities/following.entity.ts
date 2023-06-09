import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum FollowState {
  requestSent = 'requestSent',
  following = 'following',
}

@Entity()
export class Following {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followedId: number;

  @Column({
    type: 'simple-enum',
    enum: FollowState,
  })
  followState: FollowState;

  @CreateDateColumn()
  date: Date;
}
