/* eslint-disable no-console */
/* eslint-disable import/no-internal-modules */
import "./utils/env";
import { App, LogLevel } from "@slack/bolt";
import { schedule } from "./schedule";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
  socketMode: false,
});

app.use(async ({ next }) => {
  await next();
});

// Listens to incoming messages that contain "hello"

app.event("app_home_opened", async ({ event, client, logger }) => {
  var s = new schedule();
  await s.getView(event, client, logger);
});

(async () => {
  // Start your app
  await app.start(Number(process.env.PORT) || 3000);

  console.log("⚡️ Bolt app is running!");
})();
