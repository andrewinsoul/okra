import Puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import { constants } from '../constants';

interface AccountTransactionType {
  [key: string]: Array<{
    type: string;
    date: string;
    narration: string;
    amount: string;
    beneficiary: string;
    sender: string;
    accountNumber: string;
  }>;
}

export class ExtractData {
  async automateLogin(
    browser: Browser | undefined,
    url: string,
    authPayload: {
      emailAddress: string;
      password: string;
      otpValue: string;
    },
  ): Promise<any> {
    try {
      const page = await browser?.newPage();
      page?.on('dialog', async (dialog: { accept: () => void }) => {
        await dialog.accept();
      });
      await page?.goto(url, { waitUntil: 'networkidle0' });
      await page?.click('a[href="/login"]');

      await page?.waitForSelector('input#email');
      const { emailAddress, password, otpValue } = authPayload;
      await page?.type('input#email', emailAddress);
      await page?.type('input#password', password);
      await Promise.all([
        page?.click('button[type="submit"]'),
        page?.waitForNavigation({ waitUntil: ['networkidle2'] }),
      ]);
      await page?.waitForSelector('label[for="otp"]');
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
      const signOutLink = await page.$x("//a[contains(text(), 'Sign out')]");
      signOutLink ? await signOutLink[0].click() : undefined;
    } catch (error: any) {
      throw error;
    }
  }

  async scrapeCustomerInfo(authPayload: {
    emailAddress: string;
    password: string;
    otpValue: string;
  }): Promise<{
    clientName: string;
    clientAddress: string;
    clientBVN: string;
    clientPhone: string;
    clientEmail: string;
  }> {
    let browser, page;
    try {
      browser = await Puppeteer.launch();
      page = await this.automateLogin(browser, constants.URL, authPayload);
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
    } catch (error: any) {
      throw error;
    } finally {
      page && (await this.automateLogout(page));
      await browser?.close();
    }
  }

  async scrapeCustomerAccountData(authPayload: {
    emailAddress: string;
    password: string;
    otpValue: string;
  }): Promise<
    Array<{
      availableBal: string;
      ledgerBal: string;
      accountNumber: string;
    }>
  > {
    let browser, page;
    try {
      browser = await Puppeteer.launch();
      page = await this.automateLogin(browser, constants.URL, authPayload);
      let accountSectionDivs = await page.$$eval(
        "div[class='w-full flex-1']",
        (accountSectionTags: Array<{ textContent: string }>) => {
          return accountSectionTags.map(
            (accountSectionTag) => accountSectionTag.textContent,
          );
        },
      );
      const accountNumberLists = await page.$$eval(
        "div[class='flex-1 w-full'] > a",
        (viewAccounts: Array<{ getAttribute: (attr: string) => string }>) => {
          return viewAccounts.map((viewAccount) =>
            viewAccount.getAttribute('href'),
          );
        },
      );
      accountSectionDivs = accountSectionDivs.map(
        (item: string, index: number) =>
          `${item} ${accountNumberLists[index].split('-')[1]}`,
      );
      const accountStatement = accountSectionDivs.map((item: string) => {
        return {
          availableBal: `$${Number(
            item.split(' ')[2].slice(0, -1),
          ).toLocaleString()}`,
          ledgerBal: `$${Number(item.split(' ')[3]).toLocaleString()}`,
          accountNumber: item.split(' ').slice(-1)[0],
        };
      });
      return accountStatement;
    } catch (error: any) {
      throw error;
    } finally {
      page && (await this.automateLogout(page));
      await browser?.close();
    }
  }

  groupTableDataByRow(rawData: Array<string>): Array<Array<string>> {
    let dataArray: Array<string> = [];
    const containerArray: Array<Array<string>> = [];
    let index = 0;
    rawData.forEach((item) => {
      if (index === 6) {
        containerArray.push(dataArray);
        dataArray = [];
        dataArray.push(item);
        index = 0;
      } else {
        dataArray.push(item);
      }
      index = index + 1;
    });
    containerArray.push(dataArray);
    return containerArray;
  }

  async extractTablePaginatedData(page: Page): Promise<any> {
    try {
      const trTagsArrays = await page.$$eval(
        'tbody > tr > td, tbody > tr > th',
        (trTags: Array<{ innerHTML: string }>) => {
          return trTags.map((trTag) => `${trTag.innerHTML} `);
        },
      );
      const formattedData = this.groupTableDataByRow(trTagsArrays);
      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async *scrapeCustomerAccountTransactions(authPayload: {
    emailAddress: string;
    password: string;
    otpValue: string;
  }): AsyncGenerator<
    Array<{
      type: string;
      date: string;
      narration: string;
      amount: string;
      beneficiary: string;
      sender: string;
      accountNumber: string;
    }>
  > {
    let browser, page;
    try {
      browser = await Puppeteer.launch({ headless: false });
      page = await this.automateLogin(browser, constants.URL, authPayload);
      const viewAccountBtns: Array<ElementHandle> = await page.$x(
        "//a[contains(text(), 'View Account')]",
      );
      const numberOfCustomerAccounts = viewAccountBtns.length;
      const accountTransactionData: AccountTransactionType = {};
      for (let i = 0; i < numberOfCustomerAccounts; i++) {
        const currentAccount = viewAccountBtns[i];
        let currentOffset: number;
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
        const limit: number = +spanPaginationsDataArray[2].trim();
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
          const accountTransactionData = formattedData.map(
            (item: Array<string>) => ({
              type: item[0].trim(),
              clearedDate: item[1],
              narration: item[2],
              amount: item[3],
              beneficiary: item[4],
              sender: item[5],
              accountNumber,
            }),
          );
          await nextBtn[0].click();
          await page?.waitForSelector('tbody');
          yield accountTransactionData;
        } while (currentOffset !== limit);
        await page?.goBack({ waitUntil: ['networkidle0'] });
        await page?.waitForNavigation({ waitUntil: ['networkidle0'] });
        await page?.waitForSelector("h1[class*='text-2xl']");
      }
      return accountTransactionData;
    } catch (error: any) {
      throw error;
    } finally {
      page && (await this.automateLogout(page));
      await browser?.close();
    }
  }
}
