import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "../../notes/entities/note.entity";

@Entity()
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Note, (note) => note.likes, { eager: true })
  note: Note;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdDate: Date;
}