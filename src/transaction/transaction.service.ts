import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AndrewTransaction, TransactionDocument } from './transaction.schema';
import { ExtractData } from 'src/utils/extractData';

@Injectable()
export class TransactionService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewTransaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}
  async saveTransactionInfo(): Promise<void> {
    try {
      const authPayload = {
        emailAddress: this.config.get('USER_EMAIL') || '',
        password: this.config.get('USER_PASSWORD') || '',
        otpValue: this.config.get('OTP') || '',
      };
      const transactionData =
        await new ExtractData().scrapeCustomerAccountTransactions(authPayload);
      const data: Array<{
        type: string;
        clearedDate: string;
        narration: string;
        amount: string;
        beneficiary: string;
        sender: string;
        accountNumber: string;
      }> = [];
      Object.keys(transactionData).forEach((accountNumber) =>
        transactionData[accountNumber].forEach((transaction) => {
          data.push({
            type: transaction.type,
            clearedDate: transaction.date,
            narration: transaction.narration,
            amount: transaction.amount,
            beneficiary: transaction.beneficiary,
            sender: transaction.sender,
            accountNumber: transaction.accountNumber,
          });
        }),
      );
      await this.transactionModel.create(data);
    } catch (error) {
      throw error;
    }
  }
}
