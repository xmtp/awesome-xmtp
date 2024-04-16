/* New: This file is a utility for the heartbeat mechanism. 
It is used to send a heartbeat message to the bot every minute.
If the bot does not receive a heartbeat message for more than 2 minutes, it will restart the process. */

import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import cron from "node-cron";

const INTERVAL = process.env.DEBUG === "true" ? 10000 : 300000; // 5 minutes'
const DELAY = INTERVAL * 1.5;

let latestHeartbeat: number | null = null;
const FAILS_BEFORE_RESTART = 2;

export const round = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const writeHeartbeat = async (debugMessageCount: number) => {
  if (process.env.DEBUG === "true") {
    if (debugMessageCount > FAILS_BEFORE_RESTART) {
      console.log(
        "DEBUG MODE: Db not updated with last sync. Fails siletnly.",
        debugMessageCount
      );
      return false;
    }
  }
  latestHeartbeat = new Date().getTime();
  return true;
};

export const checkHeartbeat = async () => {
  if (latestHeartbeat === null) {
    console.log("No last heartbeat found.");
    return false;
  }
  const millisecondsSinceLastSync = new Date().getTime() - latestHeartbeat;
  if (millisecondsSinceLastSync > DELAY) {
    console.log(
      `Heartbeat updated: ${round(
        millisecondsSinceLastSync / 60000
      )} minutes since last sync. RESTARTING PROCESS.`
    );
    return true;
  } else {
    if (process.env.DEBUG === "true")
      console.log(
        `DEBUG MODE: No need to update heartbeat: ${round(
          millisecondsSinceLastSync / 60000
        )} minutes since last sync.`
      );
    return false;
  }
};

export const sendHeartbeat = async () => {
  try {
    let wallet = new Wallet(process.env.HEARTBEAT_BOT_KEY as string);
    const client = await Client.create(wallet, {
      env: process.env.XMTP_ENV as any,
    });

    const conversation = await client.conversations.newConversation(
      process.env.PUBLIC_BOT_ADDRESS as string
    );
    await conversation.send("Heartbeat");

    if (process.env.DEBUG === "true") console.log("DEBUG MODE: Heartbeat sent");
  } catch (error) {
    console.log("Error sending heartbeat:", error);
  }
};
export const scheduleHeartbeat = () => {
  console.log("Scheduling heartbeat.");
  cron.schedule(
    "*/5 * * * *",
    () => {
      sendHeartbeat();
    },
    {
      runOnInit: false,
    }
  );
};
if (process.env.HEARTBEAT_BOT_KEY) {
  scheduleHeartbeat();
  console.log("Heartbeat interval set to", round(INTERVAL / 60000), "minutes");
  setInterval(async () => {
    sendHeartbeat();
    const shouldRestart = await checkHeartbeat();
    if (shouldRestart) process.exit(1);
  }, INTERVAL);
}
