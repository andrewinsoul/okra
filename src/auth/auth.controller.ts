import {
  Controller,
  Get,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async extractAuthInfo(@Res() res: Response) {
    try {
      await this.authService.extractAndSaveAuthInfo();
      return res
        .status(200)
        .json({ message: 'auth information saved', status: 200 });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
