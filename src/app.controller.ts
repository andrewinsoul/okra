import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('/extract')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/customer/info')
  async scrapeCustomerInfo(@Res() res: Response) {
    try {
      const data = await this.appService.scrapeCustomerInfo();
      return res.status(200).json({ data, status: 200 });
    } catch (err) {
      return res.status(500).json({ error: err.message, status: 500 });
    }
  }

  @Get('/account/info')
  async scrapeCustomerAccountInfo(@Res() res: Response) {
    try {
      const data = await this.appService.scrapeCustomerAccountData();
      return res.status(200).json({ data, status: 200 });
    } catch (err) {
      return res.status(500).json({ error: err.message, status: 500 });
    }
  }

  @Get('/account/transactions')
  async scrapeCustomerAccountTransactions(@Res() res: Response) {
    try {
      const data = await this.appService.scrapeCustomerAccountTransactions();
      return res.status(200).json({ data, status: 200 });
    } catch (err) {
      return res.status(500).json({ error: err.message, status: 500 });
    }
  }
}
