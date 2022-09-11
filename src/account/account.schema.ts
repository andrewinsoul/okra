import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { AndrewCustomer } from '../customer/customer.schema';

export type AccountDocument = AndrewAccount & Document;

@Schema({ timestamps: true })
export class AndrewAccount {
  @Prop()
  availableBalance: string;

  @Prop()
  ledgerBalance: string;

  @Prop()
  accountNumber: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'AndrewCustomer' })
  customer: AndrewCustomer;
}

export const AccountSchema = SchemaFactory.createForClass(AndrewAccount);
