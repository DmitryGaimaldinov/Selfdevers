import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(type => User, user => user.posts)
  // creator: User;

  // TODO: возможно нужен { default: [] }
  @Column('text', { array: true })
  imageUrls: string[];

  @Column({ default: 0 })
  likeCount: number;

  @OneToOne((type) => Post, { nullable: true })
  parentPost: Post;

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  creationDate: Date;
}