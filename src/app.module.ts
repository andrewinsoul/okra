import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';

const envFilePath = path.join(__dirname, '..', '/.env');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(process.env.CONN_URI || ''),
    AuthModule,
    CustomerModule,
  ],
})
export class AppModule {}
