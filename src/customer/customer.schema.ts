import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Auth } from '../auth/auth.schema';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  bvn: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'Auth' })
  auth: Auth;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
