import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountSchema, AndrewAccount } from './account/account.schema';
import { AndrewCustomer, CustomerSchema } from './customer/customer.schema';
import { AndrewAuth, AuthSchema } from './auth/auth.schema';
import {
  AndrewTransaction,
  TransactionSchema,
} from './transaction/transaction.schema';

const envFilePath = path.join(__dirname, '..', '/.env');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(process.env.CONN_URI || ''),
    MongooseModule.forFeature([
      {
        name: AndrewAccount.name,
        schema: AccountSchema,
      },
      {
        name: AndrewCustomer.name,
        schema: CustomerSchema,
      },
      {
        name: AndrewAuth.name,
        schema: AuthSchema,
      },
      {
        name: AndrewTransaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
