import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async extractTransactionInfo(@Res() res: Response) {
    try {
      await this.transactionService.saveTransactionInfo();
      return res
        .status(200)
        .json({ message: 'transaction information saved', status: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500 });
    }
  }
}
