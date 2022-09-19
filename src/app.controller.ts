import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { CreateAuthDTO } from './auth/auth.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/ping')
  scrapeCustomerInfo(@Res() res: Response) {
    return res.status(200).json({ message: 'WELOME ONBOARD!!', status: 200 });
  }

  @Post('/scrape')
  async scrapeInfo(@Body() createAuthDTO: CreateAuthDTO, @Res() res: Response) {
    try {
      await this.appService.scrapeData(createAuthDTO);
      return res.status(200).json({
        message: 'Data successfully scrapped',
        status: 200,
      });
    } catch (error) {
      if (error.code === 'AUTH_ERROR') {
        return res.status(403).json({
          error:
            'Please create an account on https://bankof.okra.ng/register and sign in with the right credentials',
          status: 403,
        });
      }
      return res.status(500).json({ error: error.message, status: 500 });
    }
  }
}
