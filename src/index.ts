import { WebClient } from "@slack/web-api";
import puppeteer from "puppeteer";

import { BPTM_ADMIN, BPTM_ADMIN_PWD } from "./puppeteer/global";
import { clickByText, enterInputValue, navigateClick } from "./puppeteer/helper";
const requestTimeOut = 30000;

interface IAgendaCell {
  member: string;
  role: string;
  signed: boolean;
}

// const generateMessage = async (agenda: Map<string, IAgendaCell>) => {
//   let text: string = "Hello Dear Toastmasters! \nThe agenda this week will be: \n ";
//   const unassignedRoles: string[] = new Array();
//   Object.values(agenda).forEach((a: IAgendaCell)  => {
//     // tslint:disable-next-line:no-console
//     console.log("role is: " + a.role);
//     if (a.signed) {
//        text += a.role + " : " + a.member + "\n";
//     } else {
//       unassignedRoles.push(a.role);
//     }
//   });

//   if (unassignedRoles.length > 0) {
//     text += "\n Please hurry up to fill in the following *unassigned* roles: \t";
//     for (let i = 0; i < unassignedRoles.length; i++) {
//       text += unassignedRoles[i];
//       if (i < unassignedRoles.length - 1) {
//         text += ", ";
//       }
//     }
//   }
//   return text;
// };

const sendSlackNotification = (agenda: Map<string, IAgendaCell>) => {

  const token = process.env.SLACK_TOKEN;

  const web = new WebClient(token);

  const conversationId = "GMHHVSL5D";

  Object.values(agenda).forEach((a: IAgendaCell)  => {
    // tslint:disable-next-line:no-console
    console.log("role is: " + a.role);
  });

  let text: string = "Hello Dear Toastmasters! \nThe agenda this week will be: \n ";
  const unassignedRoles: string[] = new Array();
  Object.values(agenda).forEach((a: IAgendaCell)  => {
    // tslint:disable-next-line:no-console
    console.log("role is: " + a.role);
    if (a.signed) {
       text += a.role + " : " + a.member + "\n";
    } else {
      unassignedRoles.push(a.role);
    }
  });

  if (unassignedRoles.length > 0) {
    text += "\n Please hurry up to fill in the following *unassigned* roles: \t";
    for (let i = 0; i < unassignedRoles.length; i++) {
      text += unassignedRoles[i];
      if (i < unassignedRoles.length - 1) {
        text += ", ";
      }
    }
  }
  // const text = await generateMessage(agenda);

  (async () => {
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await web.chat.postMessage({ channel: conversationId, text });
    // `res` contains information about the posted message
    // tslint:disable-next-line:no-console
    console.log("Message sent: ", res.ts);
  })();

};

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

  await page.evaluate(() => {
    const agenda: Map<string, IAgendaCell> = new Map();
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
      // tslint:disable-next-line:no-console
      // console.log("role is: " + role + " member is: " + memberName);
      agenda.set(role, {
        member: memberName,
        role,
        signed,
      });
      // tslint:disable-next-line:no-console
      console.log("size is: " + agenda.size);
    }
    // tslint:disable-next-line:no-console
    console.log("size is: " + agenda.size);
    return agenda;
  }).then((agenda) => {
    // tslint:disable-next-line:no-console
    console.log("size is: " + agenda.size);
    sendSlackNotification(agenda);
  });

  // tslint:disable-next-line:no-console
  // console.log("size is: " + meetingAgenda.size);
  // Object.values(meetingAgenda).forEach((a: IAgendaCell)  => {
  //   // tslint:disable-next-line:no-console
  //   console.log("role is: " + a.role);
  // });

  // tslint:disable-next-line:no-console
  // console.log("values are: ", meetingAgenda.values());
  // send slack notification
  // await

  await page.waitFor(requestTimeOut);
  //
  await page.screenshot({path: "test.png", fullPage: true});

  await browser.close();
})();

// (async () => {
//   const meetingAgenda: IAgendaCell[] = new Array();
//   await sendSlackNotification(meetingAgenda);
// })();

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
