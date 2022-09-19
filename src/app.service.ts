import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AndrewAuth, AuthDocument } from './auth/auth.schema';
import { CreateAuthDTO } from './auth/auth.dto';
import { ExtractData } from 'src/utils/extractData';
import { constants } from 'src/constants';
import { AndrewCustomer, CustomerDocument } from './customer/customer.schema';
import { AccountDocument, AndrewAccount } from './account/account.schema';
import {
  AndrewTransaction,
  TransactionDocument,
} from './transaction/transaction.schema';

@Injectable()
export class AppService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewAuth.name)
    private readonly authModel: Model<AuthDocument>,
    @InjectModel(AndrewCustomer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(AndrewAccount.name)
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel(AndrewTransaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async scrapeData(createAuthDTO: CreateAuthDTO): Promise<any> {
    let page, browser;
    const ScrapeDataInstance = new ExtractData();
    try {
      [page, browser] = await ScrapeDataInstance.automateLogin(
        constants.URL,
        {
          emailAddress: createAuthDTO.email,
          password: createAuthDTO.password,
          otpValue: '12345',
        },
        this.config.get('NODE_ENV') || 'development',
      );
      const customerInfo = await ScrapeDataInstance.scrapeCustomerInfo(page);
      const accounts = await ScrapeDataInstance.scrapeCustomerAccountData(page);
      const {
        clientAddress: address,
        clientPhone: phone,
        clientEmail: email,
        clientBVN: bvn,
        clientName: name,
      } = customerInfo;
      let authData: any = await this.authModel.findOne({
        email: createAuthDTO.email,
      });
      if (!authData) {
        authData = await new this.authModel(createAuthDTO).save();
      }
      const { id: auth } = authData;
      let customerData: any = await this.customerModel.findOne({
        email: createAuthDTO.email,
      });
      if (!customerData) {
        customerData = await new this.customerModel({
          address,
          phone,
          email,
          name,
          bvn,
          auth,
        }).save();
      }
      const { id: customer } = customerData;
      await this.accountModel.create(
        accounts.map((item) => ({
          accountNumber: item.accountNumber,
          availableBalance: item.availableBal,
          ledgerBalance: item.ledgerBal,
          customer,
        })),
      );
      const transactionIterator =
        new ExtractData().scrapeCustomerAccountTransactions(page);
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
    } finally {
      page && (await ScrapeDataInstance.automateLogout(page));
      await browser?.close();
    }
  }
}
