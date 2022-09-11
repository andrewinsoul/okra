import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = AndrewAuth & Document;

@Schema({ timestamps: true })
export class AndrewAuth {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(AndrewAuth);
