import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema, AndrewAccount } from '../account/account.schema';
import { AccountController } from './account.controller';
import { AndrewCustomer, CustomerSchema } from '../customer/customer.schema';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AndrewAccount.name,
        schema: AccountSchema,
      },
      {
        name: AndrewCustomer.name,
        schema: CustomerSchema,
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
