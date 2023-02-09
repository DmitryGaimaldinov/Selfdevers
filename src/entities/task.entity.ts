import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContactInfo } from "./contact-info.entity";
import { Employee } from "./employee.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, employee => employee.tasks, {onDelete: 'SET NULL'})
  employee: Employee;
}