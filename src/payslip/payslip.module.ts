import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayslipService } from './payslip.service';
import { PayslipController } from './payslip.controller';
import { Employee } from '../entities/employee.entity';
import { Overtime } from '../entities/overtime.entity';
import { Deduction } from '../entities/deduction.entity';
import { LeaveRequest } from '../entities/leave.entity';
import { Payslip } from '../entities/payslip.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Overtime, Deduction, LeaveRequest, Payslip]),
  ],
  providers: [PayslipService],
  controllers: [PayslipController],
})
export class PayslipModule {}
