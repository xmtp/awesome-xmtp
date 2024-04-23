/* New: This file is a utility for the heartbeat mechanism. 
It is used to send a heartbeat message to the bot every minute.
If the bot does not receive a heartbeat message for more than 2 minutes, it will restart the process. */

import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import cron from "node-cron";

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
  if (process.env.HEARTBEAT_BOT_KEY) {
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
  }
};
