import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Customer } from '../customer/customer.schema';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop()
  availableBalance: string;

  @Prop()
  ledgerBalance: string;

  @Prop()
  accountNumber: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
