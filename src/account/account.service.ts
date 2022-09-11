import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AndrewAccount, AccountDocument } from './account.schema';
import { AndrewCustomer, CustomerDocument } from '../customer/customer.schema';
import { ExtractData } from 'src/utils/extractData';

@Injectable()
export class AccountService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewCustomer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(AndrewAccount.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}
  async saveAccountInfo(): Promise<void> {
    try {
      const customerData = await this.customerModel.findOne({
        email: this.config.get('USER_EMAIL') || '',
      });
      const authPayload = {
        emailAddress: this.config.get('USER_EMAIL') || '',
        password: this.config.get('USER_PASSWORD') || '',
        otpValue: this.config.get('OTP') || '',
      };
      const id = customerData?.id;
      const accounts = await new ExtractData().scrapeCustomerAccountData(
        authPayload,
      );
      await this.accountModel.create(
        accounts.map((item) => ({
          accountNumber: item.accountNumber,
          availableBalance: item.availableBal,
          ledgerBalance: item.ledgerBal,
          customer: id,
        })),
      );
    } catch (error) {
      throw error;
    }
  }
}
