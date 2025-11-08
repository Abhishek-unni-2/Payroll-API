import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Deduction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, e => e.deductions)
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  reason: string;
}
