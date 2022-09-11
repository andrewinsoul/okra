import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AndrewAuth, AuthSchema } from 'src/auth/auth.schema';
import { CustomerController } from './customer.controller';
import { AndrewCustomer, CustomerSchema } from './customer.schema';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AndrewCustomer.name,
        schema: CustomerSchema,
      },
      {
        name: AndrewAuth.name,
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
