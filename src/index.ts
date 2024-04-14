import "dotenv/config";
import HandlerContext from "./lib/handler-context";
import run from "./lib/runner.js";
const inMemoryCache = new Map<string, number>();

run(async (context: HandlerContext) => {
  const { message } = context;

  const { content, senderAddress } = message;

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
    "6": "Starter Bot: echo.hi.xmtp.eth : A bot that simply echoes what you send it.",
    "7": "Awesome Bot: awesome.hi.xmtp.eth : Learn evetything about frames and bots.",
  };

  const framesInfo = {
    "1": "Farguessr Frame: Guess the distance between 2 countries",
    "2": "Openframedl Frame: Wordle in a frame",
    "3": "Zora Magic Machine Frame: Zora newsletter",
    "4": "Rock Paper Scissors Frame: Rock paper scissors game",
    "5": "FC Polls: Farcaster Polls working on messaging apps",
    "6": "Mint Frame: Frame for redirecting users to mint on Zora",
    "7": "Transaction Frame: Frame that acts a transaction receipt",
    "8": "Gitcoin Grants: Grant that showcases Gitcoin grants",
  };
  const frameUrls = [
    "Farguessr Frame: https://farguessr.vercel.app/",
    "Openframedl Frame: https://openframedl.vercel.app/",
    "Zora Magic Machine Frame: https://paragraph.xyz/@zora/zora-magic-machine/",
    "Rock Paper Scissors Frame: https://xmtp-frame-rock-paper-scissors.vercel.app/",
    "FC Polls: https://fc-polls.vercel.app/polls/87b1ed3f-5f86-479a-acc7-727943eecfe3/",
    "Mint Frame: https://trending-mints.vercel.app/?chain=base&a=0x87c082a2e681f4d2da35883a1464954d59c35d3a&c=790",
    "Transaction Frame: https://tx-receipt.vercel.app/?networkId=linea_goerli&txLink=https://goerli.lineascan.build/tx/0x2d49400176fb1d4a7a36edf0b60aaa43b1432bf551b26c5517181f0ea42b1a07",
  ];
  const testingBotsInfo = {
    starter:
      "Starter Bot: A basic bot for initial testing. 0x61175cdB3cdC0459896e10Cce0A4Dab49FD69702",
    "starter-cron":
      "Starter-Cron Bot: Tests scheduled messages. 0x4e58F676Fd4a4a6F9A99C79b3ddd2a2c133cE1C4",
    "starter-heartbeat":
      "Starter-Heartbeat Bot: Tests the heartbeat and reliability of the system. 0x3E4EFc2B2Ee3fCE01433F2E75021eeACd62CA94f",
  };

  if (!step) {
    const fullBotDescriptions = Object.entries(botInfo)
      .map(([, value]) => `- ${value}`)
      .join("\n");
    await context.reply(
      `Welcome to the Awesome XMTP Bot. Explore bots and frames from the ecosystem. Imagine it as the app store for chat apps 🤖🖼️`
    );
    await context.reply(`Bots:\n\n${fullBotDescriptions}`);

    const testingBotsDescriptions = Object.entries(testingBotsInfo)
      .map(([, value]) => `- ${value}`)
      .join("\n");

    await context.reply(`Testing Bots:\n\n${testingBotsDescriptions}`);

    const framesMessage =
      `Also, explore these Frames compatible with Open Frames 🖼️:\n\n` +
      frameUrls.map((url) => `- ${url}`).join("\n") +
      `\n\nDiscover more frames in Awesome Open Frames https://github.com/open-frames/awesome-open-frames ✨.`;

    await context.reply(framesMessage);
    inMemoryCache.set(senderAddress, 1);
  }
});
