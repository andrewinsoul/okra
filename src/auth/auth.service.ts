import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.schema';

@Injectable()
export class AuthService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  async extractAndSaveAuthInfo(): Promise<any> {
    try {
      const authInfo = new this.authModel({
        email: this.config.get('USER_EMAIL') || '',
        password: this.config.get('USER_PASSWORD') || '',
      });
      await authInfo.save();
    } catch (error) {
      throw error;
    }
  }
}
