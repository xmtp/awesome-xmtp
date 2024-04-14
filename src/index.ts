import "dotenv/config";
import { Wallet } from "ethers";
import HandlerContext from "./handler-context";
import run from "./runner.js";
const inMemoryCache = new Map<string, number>();

run(async (context: HandlerContext) => {
  const { message } = context;
  const wallet = new Wallet(process.env.KEY!);

  const { content, senderAddress } = message;

  if (senderAddress?.toLowerCase() === wallet.address?.toLowerCase()) {
    // safely ignore this message
    return;
  }

  // get the current step we're in
  const step = inMemoryCache.get(senderAddress);

  // check if the message is an unsubscribe message
  if (content?.toLowerCase() === "stop") {
    inMemoryCache.delete(senderAddress); // Reset the step for future interactions
    return;
  }

  if (!step) {
    // send the first message
    await context.reply(
      "Welcome to the XMTP Bots and Frames Info Service. Select a bot to get more information:\n\n1. Trending Mints Bot\n2. Faucet Bot\n3. AI Docs Bot\n4. GeneralStore Bot\n5. Wordle a Day Bot\n6. AI GPT Bot\n7. POAP Bot\n8. Notification Api Bot\n9. Defi Bot\n\n✍️ (reply with the number of the bot you're interested in)"
    );

    inMemoryCache.set(senderAddress, 1);
  } else if (step === 1) {
    const botInfo = {
      "1": "Trending Mints Bot (`trendingmints.eth`): Subscribe to get real-time trending mints in Base through Zora and mint through daily messages. Uses [Mint Frame](https://github.com/fabriguespe/mint-frame/tree/main).",
      "2": "Faucet Bot (`faucetbot.eth`): Delivers Faucet funds to devs on Testnet. Powered by [Learnweb3](https://learnweb3.io/faucets/). Uses [Tx Receipt Frame](https://github.com/fabriguespe/faucet-tx-frame).",
      "3": "AI Docs Bot (`docs.hi.xmtp.eth`): Chat with the XMTP [Docs](https://xmtp.org/docs/introduction) through an API with a GPT powered bot. Powered by [Kapa](https://kapa.ai/).",
      "4": "GeneralStore Bot (`store.hi.xmtp.eth`): Order goodies in hackathons.",
      "5": "Wordle a Day Bot (`dailywordle.eth`): Play daily to the WORDLE game by [du8](https://warpcast.com/ds8/0x2d31015a) through messaging.",
      "6": "AI GPT Bot: GPT Powered bot for engaging conversations. TBD",
      "7": "POAP Bot: Delivering a POAP through messaging. TBD",
      "8": "Notification Api Bot: Intermediary subscriber bot for notifications. TBD",
      "9": "Defi Bot: Prompt to defi transaction frame Bot. TBD",
    };

    //@ts-ignore
    const selectedBotInfo = botInfo[content];
    if (!selectedBotInfo) {
      await context.reply(
        "Invalid option selected. Please enter a valid option (1 through 9)"
      );
      return;
    }

    await context.reply(selectedBotInfo);

    // Optionally, move to the next step or reset the step for future interactions
    inMemoryCache.delete(senderAddress); // Reset the step for future interactions
  }
});
