import createClient from "./client.js";
import HandlerContext from "./handler-context.js";
import { writeHeartbeat } from "./heartbeat.js";

type Handler = (message: HandlerContext) => Promise<void>;

export default async function run(handler: Handler) {
  let shouldRestart = false; // Flag to control restarts

  do {
    try {
      shouldRestart = false;
      let debugMessageCount = 0;
      writeHeartbeat(debugMessageCount); //sent first to prevent infinit loop
      const client = await createClient();
      console.log(`Listening on ${client.address} `);
      for await (const message of await client.conversations.streamAllMessages()) {
        /* This code is reliability code*/
        if (message.senderAddress == client.address) continue;
        if (process.env.DEBUG == "true") debugMessageCount++; //#for debugging purposes
        if (!(await writeHeartbeat(debugMessageCount))) continue; // Heartbeat mechanism check
        /*Here the logic starts*/
        const context = new HandlerContext(message);
        await handler(context);
      }
    } catch (e) {
      console.log(`Error:`, e);
    }
  } while (shouldRestart);

  console.log("Stream processing ended or restarted based on condition.");
}
