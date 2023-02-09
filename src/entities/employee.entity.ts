import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContactInfo } from "./contact-info.entity";
import { Task } from "./task.entity";
import { Meeting } from "./meeting.entity";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => ContactInfo, contactInfo => contactInfo.employee)
  contactInfo: ContactInfo;

  @OneToMany(() => Task, task => task.employee)
  tasks: Task[];

  @ManyToOne(() => Employee, employee => employee.directReports, {onDelete: 'SET NULL'})
  manager: Employee;

  @OneToMany(() => Employee, employee => employee.manager)
  directReports: Employee[];

  @ManyToMany(() => Meeting, meeting => meeting.attendees)
  @JoinTable()
  meetings: Meeting[];
}