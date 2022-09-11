import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AndrewCustomer, CustomerDocument } from './customer.schema';
import { AndrewAuth, AuthDocument } from '../auth/auth.schema';
import { ExtractData } from 'src/utils/extractData';

@Injectable()
export class CustomerService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewCustomer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(AndrewAuth.name)
    private readonly authModel: Model<AuthDocument>,
  ) {}
  async saveCustomerInfo(): Promise<any> {
    try {
      const authData = await this.authModel.findOne({
        email: this.config.get('USER_EMAIL') || '',
      });
      const authPayload = {
        emailAddress: this.config.get('USER_EMAIL') || '',
        password: this.config.get('USER_PASSWORD') || '',
        otpValue: this.config.get('OTP') || '',
      };
      const id = authData?.id;
      const customerInfo = await new ExtractData().scrapeCustomerInfo(
        authPayload,
      );
      const {
        clientAddress: address,
        clientPhone: phone,
        clientEmail: email,
        clientBVN: bvn,
        clientName: name,
      } = customerInfo;
      await new this.customerModel({
        address,
        phone,
        email,
        name,
        bvn,
        auth: id,
      }).save();
    } catch (error) {
      throw error;
    }
  }
}
