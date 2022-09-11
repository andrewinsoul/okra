import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { AndrewAccount } from '../account/account.schema';

export type TransactionDocument = AndrewTransaction & Document;

@Schema({ timestamps: true })
export class AndrewTransaction {
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

  @Prop({
    type: mongooseSchema.Types.String,
    ref: 'AndrewAccount.accountNumber',
  })
  account: AndrewAccount;
}

export const TransactionSchema =
  SchemaFactory.createForClass(AndrewTransaction);
