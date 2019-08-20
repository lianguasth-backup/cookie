import puppeteer from "puppeteer";

import { BPTM_ADMIN, BPTM_ADMIN_PWD } from "./puppeteer/global";
import { clickByText, enterInputValue, navigateClick } from "./puppeteer/helper";
const requestTimeOut = 30000;

interface IAgendaCell {
  member: string;
  role: string;
  signed: boolean;
}

(async () => {
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();

  // login
  await page.goto("https://biopacific.toastmastersclubs.org/index.cgi?adminauth+" + BPTM_ADMIN + "+" + BPTM_ADMIN_PWD);

  // close pop up window
  await clickByText(page, "Keep These and Close", "span");

  // member's only tabe
  await clickByText(page, "Members Only", "a");

  // agenda
  await clickByText(page, "Meeting Agendas", "a");

  await page.waitFor(6000);

  const agenda: IAgendaCell[] = new Array();
  await page.evaluate(() => {
    const tds = document.querySelectorAll(".agendaTable td:nth-child(2)");
    for (const td of tds) {
      const role = td.getElementsByTagName("b")[0].textContent;
      const member = td.getElementsByClassName("fth-member-name")[0];
      let memberName: string = "";
      let signed: boolean = false;
      if (member) {
        const memberWithName = member.getElementsByTagName("b")[0];
        if (memberWithName) {
          signed = true;
          memberName = memberWithName.textContent;
        }
      }
      // // tslint:disable-next-line:no-console
      // console.log("role is: " + role + " member is: " + memberName);
      agenda.push({
        member: memberName,
        role,
        signed,
      });
    }
  });
  // tslint:disable-next-line:no-console
  console.log("agenda is" + agenda);
  await page.waitFor(requestTimeOut);
  //
  await page.screenshot({path: "test.png", fullPage: true});

  await browser.close();
})();

// import express from "express";

// const app = express();
// const port = 8080; // default port to listen

// // define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//     res.send( "Hello world!" );
// } );

// // start the Express server
// app.listen( port, () => {
//     // tslint:disable-next-line:no-console
//     console.log( `server started at http://localhost:${ port }` );
// } );
