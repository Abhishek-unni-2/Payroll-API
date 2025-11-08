import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Attendance } from './entities/attendance.entity';
import { LeaveRequest } from './entities/leave.entity';
import { Overtime } from './entities/overtime.entity';
import { Deduction } from './entities/deduction.entity';
import { Payslip } from './entities/payslip.entity';
import { PayslipModule } from './payslip/payslip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        Employee,
        Department,
        Attendance,
        LeaveRequest,
        Overtime,
        Deduction,
        Payslip,
      ],
      synchronize: true,
    }),
    PayslipModule,
  ],
})
export class AppModule {}
