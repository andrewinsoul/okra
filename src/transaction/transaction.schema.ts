import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Account } from '../account/account.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop()
  type: string;

  @Prop()
  clearedDate: string;

  @Prop()
  narration: string;

  @Prop()
  amount: string;

  @Prop()
  beneficiary: string;

  @Prop()
  sender: string;

  @Prop({ type: mongooseSchema.Types.String, ref: 'Account.accountNumber' })
  account: Account;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
