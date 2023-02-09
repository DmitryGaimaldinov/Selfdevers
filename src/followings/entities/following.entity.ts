import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Following {

  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // followerId: number;
  //
  // @Column()
  // followedId: number;

  @Column()
  isAccepted: boolean;

  @CreateDateColumn()
  date: Date;

  // Переделать на айдишники, потому что меня начинает подбешивать
  @ManyToOne(type => User, user => user.followings)
  // @JoinColumn()
  follower: User;

  @ManyToOne(type => User, user => user.followers)
  // @JoinColumn()
  followed: User;
}