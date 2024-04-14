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
  const botInfo = {
    "1": "Trending Mints Bot trendingmints.eth : Subscribe to get real-time trending mints in Base through Zora and mint through daily messages.",
    "2": "Faucet Bot faucetbot.eth : Delivers Faucet funds to devs on Testnet. Powered by Learnweb3.",
    "3": "AI Docs Bot docs.hi.xmtp.eth : Chat with the XMTP Docs through an API with a GPT powered bot. Powered by Kapa.",
    "4": "GeneralStore Bot store.hi.xmtp.eth : Bot for ordering goodies in hackathons.",
    "5": "Wordle a Day Bot dailywordle.eth : Play daily through XMTP to the WORDLE game created by du8.",
    "6": "Starter Bot: 0x3E4EFc2B2Ee3fCE01433F2E75021eeACd62CA94f : A bot that simply echoes what you send it.",
  };
  if (!step) {
    // send the first message
    const fullBotDescriptions = Object.entries(botInfo)
      .map(([key, value]) => `${key}. ${value}`)
      .join("\n\n");
    await context.reply(
      `Welcome to the Awesome XMTP Bot. Explore the world of XMTP bots and frames! 🤖🖼️`
    );
    await context.reply(
      `Bots:\n\n${fullBotDescriptions}\n\nCheck out the repositories in Awesome XMTP https://github.com/xmtp/awesome-xmtp and give the repo a star 🤩`
    );

    inMemoryCache.set(senderAddress, 1);
  } else if (step === 1) {
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
