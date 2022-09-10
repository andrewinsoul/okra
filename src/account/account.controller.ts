import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async extractAccountInfo(@Res() res: Response) {
    try {
      await this.accountService.saveAccountInfo();
      return res
        .status(200)
        .json({ message: 'account information saved', status: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500 });
    }
  }
}
