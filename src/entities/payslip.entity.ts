import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Payslip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, e => e.payslips)
  employee: Employee;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ type: 'jsonb' })
  breakdown: any; // store JSON breakdown: gross, overtimePay, deductions array, net

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netPay: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
