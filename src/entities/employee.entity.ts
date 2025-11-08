import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from './department.entity';
import { Attendance } from './attendance.entity';
import { LeaveRequest } from './leave.entity';
import { Overtime } from './overtime.entity';
import { Deduction } from './deduction.entity';
import { Payslip } from './payslip.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Department, (d) => d.employees, { nullable: true })
  department: Department;

  @Column({ name: 'base_salary', type: 'decimal', precision: 12, scale: 2, default: 0 })
  baseSalary: number;

  @Column({ name: 'joined_at', type: 'date', nullable: true })
  joinedAt?: Date;

  @OneToMany(() => Attendance, (a) => a.employee)
  attendance: Attendance[];

  @OneToMany(() => LeaveRequest, (l) => l.employee)
  leaves: LeaveRequest[];

  @OneToMany(() => Overtime, (o) => o.employee)
  overtimes: Overtime[];

  @OneToMany(() => Deduction, (d) => d.employee)
  deductions: Deduction[];

  @OneToMany(() => Payslip, (p) => p.employee)
  payslips: Payslip[];
}
