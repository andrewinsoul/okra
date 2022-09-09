import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Puppeteer, { Browser, Page } from 'puppeteer';
import { groupTableDataByRow } from './app.utils';
import { constants } from './constants';

@Injectable()
export class AppService {
  @Inject(ConfigService)
  public config: ConfigService;
  async automateLogin(browser: Browser | undefined, url: string): Promise<any> {
    try {
      const page = await browser?.newPage();
      page?.on('dialog', async (dialog) => {
        await dialog.accept();
      });
      await page?.goto(url, { waitUntil: 'networkidle2' });
      await page?.click('a[href="/login"]');

      await page?.waitForSelector('input#email');
      const emailAddress = this.config.get('USER_EMAIL') || '';
      const password = this.config.get('USER_PASSWORD') || '';

      await page?.type('input#email', emailAddress);
      await page?.type('input#password', password);
      await Promise.all([
        page?.click('button[type="submit"]'),
        page?.waitForNavigation({ waitUntil: ['networkidle2'] }),
      ]);
      await page?.waitForSelector('label[for="otp"]');
      const otpValue = this.config.get('OTP') || '';
      await page?.type('input#otp', otpValue);
      await Promise.all([
        page?.click('button[type="submit"]'),
        page?.waitForNavigation({ waitUntil: ['networkidle2'] }),
      ]);
      await page?.waitForSelector("h1[class*='text-2xl']");
      return page;
    } catch (error) {
      throw error;
    }
  }

  async automateLogout(page: any) {
    try {
      const signOutLink = await page.$x(
        "//a > i[contains(text(), 'Sign out')]",
      );
      signOutLink ? await signOutLink[0].click() : undefined;
    } catch (error: any) {
      throw error;
    }
  }

  async extractTablePaginatedData(page: Page): Promise<any> {
    try {
      const trTagsArrays = await page.$$eval(
        'tbody > tr > td, tbody > tr > th',
        (trTags: Array<{ innerHTML: string }>) => {
          return trTags.map((trTag) => `${trTag.innerHTML} `);
        },
      );
      const formattedData = groupTableDataByRow(trTagsArrays);
      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async scrapeCustomerInfo(): Promise<any> {
    let browser, page;
    try {
      browser = await Puppeteer.launch();
      page = await this.automateLogin(browser, constants.URL);
      const welcomeMsg = await page.$eval(
        "h1[class*='text-2xl']",
        (name: { innerHTML: string }) => name.innerHTML,
      );
      const pTagsArrays = await page.$$eval(
        "p[class='text-default my-3']",
        (pTags: Array<{ textContent: string }>) => {
          return pTags.map((pTag) => pTag.textContent);
        },
      );
      const clientInfo = pTagsArrays.map((item: string) =>
        item.split(':')[1].trimStart(),
      );
      const [clientAddress, clientBVN, clientPhone, clientEmail] = clientInfo;
      const splitWelcomeMsg = welcomeMsg.split(' ');
      const clientName = splitWelcomeMsg.slice(2).join(' ').slice(0, -1);
      return {
        clientName,
        clientAddress,
        clientBVN,
        clientPhone,
        clientEmail,
      };
      // save the info to mongodb
    } catch (error: any) {
      throw error;
    } finally {
      await page?.this.automateLogout(page);
      await browser?.close();
    }
  }

  async scrapeCustomerAccountData(): Promise<any> {
    let browser, page;
    try {
      browser = await Puppeteer.launch();
      page = await this.automateLogin(browser, constants.URL);
      const accountSectionDivs = await page.$$eval(
        "div[class='w-full flex-1']",
        (accountSectionTags: Array<{ textContent: string }>) => {
          return accountSectionTags.map(
            (accountSectionTag) => accountSectionTag.textContent,
          );
        },
      );
      const accountStatement = accountSectionDivs.map((item: string) => ({
        availableBal: `$${Number(
          item.split(' ')[2].slice(0, -1),
        ).toLocaleString()}`,
        ledgerBal: `$${Number(item.split(' ')[3]).toLocaleString()}`,
      }));
      return accountStatement;
      // save the info to mongodb
    } catch (error: any) {
      throw error;
    } finally {
      await page?.this.automateLogout(page);
      await browser?.close();
    }
  }

  async scrapeCustomerAccountTransactions(): Promise<any> {
    let browser, page;
    try {
      browser = await Puppeteer.launch();
      page = await this.automateLogin(browser, constants.URL);
      const viewAccountBtns = await page.$x(
        "//a[contains(text(), 'View Account')]",
      );
      const accountTransactionData: { [accountNumber: string]: Array<any> } =
        {};
      for (let i = 0; i < viewAccountBtns.length; i++) {
        const currentAccount = viewAccountBtns[i];
        let currentOffset;
        await Promise.all([
          currentAccount.click(),
          page?.waitForNavigation({ waitUntil: ['networkidle2'] }),
        ]);
        await page?.waitForSelector('table');
        const nextBtn = await page.$x("//button[contains(text(), 'Next')]");
        let spanPaginationsDataArray = await page.$$eval(
          "span[class='font-semibold text-gray-900 dark:text-white']",
          (spanTags: Array<{ textContent: string }>) => {
            return spanTags.map((spanTag) => spanTag.textContent);
          },
        );
        const limit = +spanPaginationsDataArray[2].trim();
        do {
          spanPaginationsDataArray = await page.$$eval(
            "span[class='font-semibold text-gray-900 dark:text-white']",
            (spanTags: Array<{ textContent: string }>) => {
              return spanTags.map((spanTag) => spanTag.textContent);
            },
          );
          currentOffset = +spanPaginationsDataArray[1].trim();
          const formattedData = await this.extractTablePaginatedData(page);
          const accountNumber =
            formattedData[0][0].trim() === 'debit'
              ? formattedData[0][5]
              : formattedData[0][4];
          accountTransactionData[accountNumber] = [
            ...(accountTransactionData[accountNumber] || []),
            ...formattedData.map((item: Array<string>) => ({
              type: item[0].trim(),
              date: item[1],
              narration: item[2],
              amount: item[3],
              beneficiary: item[4],
              sender: item[5],
            })),
          ];
          await nextBtn[0].click();
          await page?.waitForSelector('tbody');
        } while (currentOffset !== limit);
      }
      // save to mongoDb
      return accountTransactionData;
    } catch (error: any) {
      throw error;
    } finally {
      await page?.this.automateLogout(page);
      await browser?.close();
    }
  }
}
