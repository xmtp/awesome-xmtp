import createClient from "./client.js";
import HandlerContext from "./handler-context.js";

type Handler = (message: HandlerContext) => Promise<void>;

import { scheduleHeartbeat } from "./heartbeat.js";
scheduleHeartbeat();
export default async function run(handler: Handler) {
  const client = await createClient();
  console.log(`Listening on ${client.address}`);

  for await (const message of await client.conversations.streamAllMessages(
    () => {
      console.log("Connection lost");
    }
  )) {
    try {
      if (
        message.senderAddress == client.address ||
        message.content?.toLowerCase() == "heartbeat"
      )
        continue;

      const context = new HandlerContext(message);
      await handler(context);
    } catch (e) {
      console.log(`error`, e);
    }
  }
}
