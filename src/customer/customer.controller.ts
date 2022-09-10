import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async extractCustomerInfo(@Res() res: Response) {
    try {
      await this.customerService.saveCustomerInfo();
      return res
        .status(200)
        .json({ message: 'customer information saved', status: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500 });
    }
  }
}
