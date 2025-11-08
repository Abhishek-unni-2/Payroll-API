import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'PAID' | 'UNPAID' | 'SICK' | 'CASUAL';

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, e => e.leaves)
  employee: Employee;

  @Column({ type: 'date' })
  fromDate: string;

  @Column({ type: 'date' })
  toDate: string;

  @Column({ type: 'varchar' })
  leaveType: LeaveType;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: LeaveStatus;

  @Column({ nullable: true })
  reason?: string;
}
