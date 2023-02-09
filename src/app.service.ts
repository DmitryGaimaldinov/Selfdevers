import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { ContactInfo } from "./entities/contact-info.entity";
import { Meeting } from "./entities/meeting.entity";
import { Task } from "./entities/task.entity";

@Injectable()
export class AppService {
  // constructor(
  //   @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  //   @InjectRepository(ContactInfo) private contactInfoRepo: Repository<ContactInfo>,
  //   @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
  //   @InjectRepository(Task) private taskRepo: Repository<Task>,
  // ) {}
  //
  // // Запись в базу данных
  // async seed() {
  //   // Создание объекта как new Employee()
  //   const ceo = this.employeeRepo.create({ name: 'Mr. CEO'});
  //   // Сохранение в бд
  //   await this.employeeRepo.save(ceo);
  //   // Теперь доступен ceo.id;
  //
  //   const emptyEmployee = this.employeeRepo.create();
  //
  //   const ceoContactInfo = this.contactInfoRepo.create({ email: 'email@gmail.com'});
  //   ceoContactInfo.employee = ceo;
  //   await this.contactInfoRepo.save(ceoContactInfo);
  //
  //   const manager = this.employeeRepo.create({
  //     name: 'Mario',
  //     manager: ceo,
  //   });
  //
  //   const task1 = this.taskRepo.create({ name: 'Hire people' });
  //   await this.taskRepo.save(task1);
  //   const task2 = this.taskRepo.create({ name: 'Present to CEO' });
  //   await this.taskRepo.save(task2);
  //
  //   manager.tasks = [task1, task2];
  //   await this.employeeRepo.save(manager);
  //
  //   const meeting1 = this.meetingRepo.create({ zoomUrl: 'meeting.com' });
  //   meeting1.attendees = [ceo];
  //   await this.meetingRepo.save(meeting1);
  //
  //   manager.meetings = [meeting1];
  //   await this.employeeRepo.save(manager);
  // }
  //
  // // Чтение с базы данных
  // getEmployeeById(id: number) {
  //   return this.employeeRepo.findOne({
  //     where: { id },
  //     // Указание, какие связи вернуть в запросе.
  //     // Можно указать в @OneToOne(..., ..., eager: true) и тогда связи всегда будут возвращаться
  //     relations: ['manager', 'directReports', 'tasks', 'contactInfo', 'meetings'],
  //   });
  // }
  //
  // getHello(): string {
  //   return 'Hello World!';
  // }
}
