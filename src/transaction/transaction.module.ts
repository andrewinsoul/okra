import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AndrewAccount, AccountSchema } from '../account/account.schema';
import { AndrewTransaction, TransactionSchema } from './transaction.schema';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AndrewTransaction.name,
        schema: TransactionSchema,
      },
      {
        name: AndrewAccount.name,
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
