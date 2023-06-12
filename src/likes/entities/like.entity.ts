import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "../../notes/entities/note.entity";

@Entity()
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  noteId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdDate: Date;
}