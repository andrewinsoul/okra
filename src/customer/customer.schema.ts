import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { AndrewAuth } from '../auth/auth.schema';

export type CustomerDocument = AndrewCustomer & Document;

@Schema({ timestamps: true })
export class AndrewCustomer {
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

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'AndrewAuth' })
  auth: AndrewAuth;
}

export const CustomerSchema = SchemaFactory.createForClass(AndrewCustomer);
