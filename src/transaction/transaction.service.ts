import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AndrewTransaction, TransactionDocument } from './transaction.schema';
import { AndrewAccount, AccountDocument } from '../account/account.schema';
import { ExtractData } from 'src/utils/extractData';

@Injectable()
export class TransactionService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewTransaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(AndrewAccount.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}
  async saveTransactionInfo() {
    try {
      const authPayload = {
        emailAddress: this.config.get('USER_EMAIL') || '',
        password: this.config.get('USER_PASSWORD') || '',
        otpValue: this.config.get('OTP') || '',
      };
      const transactionIterator =
        new ExtractData().scrapeCustomerAccountTransactions(authPayload);
      for await (const data of transactionIterator) {
        const account = await this.accountModel.findOne({
          accountNumber: data[0].accountNumber.trim(),
        });
        await this.transactionModel.create(
          data.map((item) => ({ ...item, account: account?.id })),
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
