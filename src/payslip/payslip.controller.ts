import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { PayslipService } from './payslip.service';
import type { Response } from 'express';
import { Parser } from 'json2csv';

@Controller('api/v1/payslips')
export class PayslipController {
  constructor(private readonly svc: PayslipService) {}

  @Post('generate')
  async generate(@Body() body: { employeeIds?: number[], month: number, year: number }) {
const results: any[] = [];
    const ids = body.employeeIds ?? [];
    if (ids.length === 0) return { message: 'No employees provided' };
    for (const eid of ids) {
      const p = await this.svc.generatePayslipForEmployee(eid, body.month, body.year);
      results.push(p);
    }
    return results;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    // fetch payslip details - implement repo call in service or inject repo
    // simplified: return placeholder if not found
    // In full project, return found payslip
  }

  @Get(':id/export/csv')
  async exportCsv(@Param('id') id: string, @Res() res: Response) {
    // fetch payslip from DB
    // For example sake, let's pretend we loaded `payslip`
    // Replace with actual repository call.
    const payslip = await (this as any).payslipRepo.findOne({ where: { id: Number(id) }, relations: ['employee']});
    if (!payslip) { res.status(404).send('Not found'); return; }

    const obj = {
      employeeId: payslip.employee.id,
      employeeName: `${payslip.employee.firstName} ${payslip.employee.lastName}`,
      month: payslip.month,
      year: payslip.year,
      netPay: payslip.netPay,
      breakdown: JSON.stringify(payslip.breakdown),
    };
    const parser = new Parser();
    const csv = parser.parse([obj]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="payslip-${id}.csv"`);
    res.send(csv);
  }
}
