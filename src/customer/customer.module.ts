import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/auth/auth.schema';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
