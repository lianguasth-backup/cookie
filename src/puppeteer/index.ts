import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://biopacific.toastmastersclubs.org/");
  await page.screenshot({path: "test.png"});

  await browser.close();
})();
