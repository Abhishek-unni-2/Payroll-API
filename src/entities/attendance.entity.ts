import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

export type AttendanceType = 'IN' | 'OUT';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, e => e.attendance)
  employee: Employee;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar' })
  type: AttendanceType;
}
