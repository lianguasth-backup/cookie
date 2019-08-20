import { Page } from "puppeteer";

const requestTimeout = 30000;

export const enterInputValue = async (page: Page, inputSelector: string, value: string) => {
  await page.waitFor(inputSelector);
  await page.focus(inputSelector);
  await page.keyboard.type(value);
};

export const navigateClick = async (page: Page, buttonSelector: string, timeout?: number) => {
  // This is the pattern recommended in the Puppeteer docs to avoid race conditions.
  // https://github.com/GoogleChrome/puppeteer/blob/v1.12.2/docs/api.md#pageclickselector-options
  const link = await page.$x(buttonSelector);
  // tslint:disable-next-line:no-console

  const [response] = await Promise.all([
    link[0].click(),
    page.waitForNavigation({ timeout: timeout || requestTimeout }),
  ]);

  // waitFor(30000);
  return response;
};

const escapeXpathString = (str: string) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

export const clickByText = async (page: Page, text: string, ele: string) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//${ele}[contains(text(), ${escapedText})]`);

  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};
