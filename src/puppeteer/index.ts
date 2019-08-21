// import * as puppeteer from "puppeteer";

// import { BPTM_ADMIN, BPTM_ADMIN_PWD } from "./global";
// import { enterInputValue, navigateClick } from "./helper";

// (async () => {
//   const browser = await puppeteer.launch({headless: false});
//   const page = await browser.newPage();
//   await page.goto("https://biopacific.toastmastersclubs.org/");

//   // login
//   await page.click("#admin_login");
//   await enterInputValue(page, "input[name='clubnumber']", BPTM_ADMIN);
//   await enterInputValue(page, "input[name='password']", BPTM_ADMIN_PWD);
//   await navigateClick(page, "button .ui-button-text:first-child");
//   //

//   await page.screenshot({path: "test.png"});

//   await browser.close();
// })();
