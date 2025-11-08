import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { Overtime } from '../entities/overtime.entity';
import { Deduction } from '../entities/deduction.entity';
import { LeaveRequest } from '../entities/leave.entity';
import { Payslip } from '../entities/payslip.entity';
import moment from 'moment';

@Injectable()
export class PayslipService {
  constructor(
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(Overtime) private otRepo: Repository<Overtime>,
    @InjectRepository(Deduction) private dedRepo: Repository<Deduction>,
    @InjectRepository(LeaveRequest) private leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(Payslip) private payslipRepo: Repository<Payslip>,
  ) {}

  private workingDaysInMonth(month: number, year: number) {
    // default: Mon-Fri working days (configurable)
    let count = 0;
    const start = moment.utc(`${year}-${String(month).padStart(2,'0')}-01`);
    const days = start.daysInMonth();
    for (let d=1; d<=days; d++) {
      const day = start.clone().date(d).day(); // 0 Sun .. 6 Sat
      if (day !== 0 && day !== 6) count++;
    }
    return count;
  }

  async generatePayslipForEmployee(employeeId: number, month: number, year: number) {
    const employee = await this.empRepo.findOne({ where: { id: employeeId }});
    if (!employee) throw new Error('Employee not found');

    const wd = this.workingDaysInMonth(month, year);
    // Leaves overlapping month
    const leaves = await this.leaveRepo.createQueryBuilder('l')
      .where('l.employeeId = :id', { id: employeeId })
      .andWhere('NOT (l.toDate < :start OR l.fromDate > :end)', {
        start: `${year}-${String(month).padStart(2,'0')}-01`,
        end: `${year}-${String(month).padStart(2,'0')}-${moment(`${year}-${month}`, 'YYYY-M').daysInMonth()}`,
      })
      .andWhere('l.status = :st', { st: 'APPROVED' })
      .getMany();

    // Count unpaid leave days only
    let unpaidDays = 0;
    for (const l of leaves) {
      const from = moment(l.fromDate);
      const to = moment(l.toDate);
      const overlapStart = moment.max(from, moment(`${year}-${String(month).padStart(2,'0')}-01`));
      const overlapEnd = moment.min(to, moment(`${year}-${String(month).padStart(2,'0')}-${moment(`${year}-${month}`,'YYYY-M').daysInMonth()}`));
      const days = overlapEnd.diff(overlapStart, 'days') + 1;
      if (l.leaveType === 'UNPAID') unpaidDays += days;
    }

    // Overtime approved in the month
    const overtimeRows = await this.otRepo.find({
      where: {
        employee: { id: employeeId },
        approved: true,
      }
    });
    // filter by month/year
    const overtimeHours = overtimeRows
      .filter(o => moment(o.date).month()+1 === month && moment(o.date).year() === year)
      .reduce((s, o) => s + Number(o.hours), 0);

    // Deductions for the month
    const deductionRows = await this.dedRepo.find({
      where: { employee: { id: employeeId } }
    });
    const monthDeductions = deductionRows
      .filter(d => moment(d.date).month()+1 === month && moment(d.date).year() === year);

    const manualDeductionsTotal = monthDeductions.reduce((s, d) => s + Number(d.amount), 0);

    // Overtime rate calculation
    const standardHoursPerDay = 8;
    const totalWorkingHours = wd * standardHoursPerDay;
    const overtimeMultiplier = 1.5;
    const overtimeRatePerHour = (Number(employee.baseSalary) / totalWorkingHours) * overtimeMultiplier;
    const overtimePay = overtimeHours * overtimeRatePerHour;

    // Unpaid leave deduction
    const perDay = Number(employee.baseSalary) / wd;
    const unpaidLeaveDeduction = perDay * unpaidDays;

    const gross = Number(employee.baseSalary) + overtimePay;
    const totalDeductions = unpaidLeaveDeduction + manualDeductionsTotal;
    const net = gross - totalDeductions;

    const breakdown = {
      baseSalary: Number(employee.baseSalary),
      overtimeHours,
      overtimePay,
      unpaidDays,
      unpaidLeaveDeduction,
      manualDeductions: monthDeductions.map(d => ({ id: d.id, amount: Number(d.amount), reason: d.reason })),
      totalDeductions,
      gross,
    };

    const payslip = this.payslipRepo.create({
      employee,
      month,
      year,
      netPay: Number(net.toFixed(2)),
      breakdown,
    });
    await this.payslipRepo.save(payslip);
    return payslip;
  }
}
