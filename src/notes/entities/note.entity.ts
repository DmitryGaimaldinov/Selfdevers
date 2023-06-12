import {
  Column,
  CreateDateColumn,
  Entity, JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { ImageEntity } from "../../photos/enitities/image.entity";
import { LikeEntity } from "../../likes/entities/like.entity";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToMany(() => ImageEntity, (imageEntity) => imageEntity.note, { eager: true })
  imageEntities: ImageEntity[];

  @ManyToOne(() => User, user => user.notes, { eager: true })
  creator: User;

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @Column({ nullable: true })
  parentId: number;

  @Column({ nullable: true })
  quotedNoteId: number;


  // @Column('text', { array: true, default: [] })
  // imageUrls: string[];

  // @Column({ default: 0 })
  // likeCount: number;


  // @OneToOne((type) => Note, { nullable: true })
  // parentNote: Note;
  //
  // // TODO: Может лучше сделать parentPostId
  // @Column({ nullable: true })
  // parentPostId: number;
  //
  // @Column('number',{ array: true, default: [] })
  // childPostIds: number[];
}