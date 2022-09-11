import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AndrewAuth, AuthDocument } from './auth.schema';
import { queryDataUtil } from 'src/utils/queryData';

@Injectable()
export class AuthService {
  @Inject(ConfigService)
  public config: ConfigService;
  constructor(
    @InjectModel(AndrewAuth.name)
    private readonly authModel: Model<AuthDocument>,
  ) {}

  async extractAndSaveAuthInfo(): Promise<any> {
    try {
      const isPopulated = await queryDataUtil(this.authModel);
      if (isPopulated) return;
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
