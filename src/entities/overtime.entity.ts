import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Overtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, e => e.overtimes)
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  hours: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  note?: string;
}
