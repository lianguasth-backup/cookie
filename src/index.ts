import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://biopacific.toastmastersclubs.org/");
  

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
