import "dotenv/config";
import HandlerContext from "./lib/handler-context";
import run from "./lib/runner.js";
const inMemoryCache = new Map<string, number>();

run(async (context: HandlerContext) => {
  const { message } = context;

  const { content, senderAddress } = message;

  // get the current step we're in
  const step = inMemoryCache.get(senderAddress);

  const botInfo = [
    "🚀 Trending Mints Bot trendingmints.eth : Subscribe to get real-time trending mints in Base through Zora and mint through daily messages.",
    "💧 Faucet Bot faucetbot.eth : Delivers Faucet funds to devs on Testnet. Powered by Learnweb3.",
    "🤖 AI Docs Bot docs.hi.xmtp.eth : Chat with the XMTP Docs through an API with a GPT powered bot. Powered by Kapa.",
    "🛍️ GeneralStore Bot store.hi.xmtp.eth : Bot for ordering goodies in hackathons.",
    "📅 Wordle a Day Bot dailywordle.eth : Play daily through XMTP to the WORDLE game created by du8.",
    "🔊 Starter Bot: echo.hi.xmtp.eth : A bot that simply echoes what you send it.",
    "🌟 Awesome Bot: awesome.hi.xmtp.eth : Learn everything about frames and bots.",
    "💬 Gpt Bot: gpt.hi.xmtp.eth : Chat with an AI powered bot.",
  ];

  const frameUrls = [
    "🌍 Farguessr : https://farguessr.vercel.app/",
    "🖼️ Wordle : https://openframedl.vercel.app/",
    "✨ Zora Magic Machine: https://paragraph.xyz/@zora/zora-magic-machine/",
    "✊ Rock Paper Scissors: https://xmtp-frame-rock-paper-scissors.vercel.app/",
    "📊 FC Polls: https://fc-polls.vercel.app/polls/87b1ed3f-5f86-479a-acc7-727943eecfe3/",
    "🌿 Mint Frame: https://trending-mints.vercel.app/?chain=base&a=0x87c082a2e681f4d2da35883a1464954d59c35d3a&c=790",
    "💼 Transactions Frame: https://tx-receipt.vercel.app/?networkId=linea_goerli&txLink=https://goerli.lineascan.build/tx/0x2d49400176fb1d4a7a36edf0b60aaa43b1432bf551b26c5517181f0ea42b1a07",
  ];
  const testingBotsInfo = [
    "Starter Bot: A basic bot for initial testing. 0x61175cdB3cdC0459896e10Cce0A4Dab49FD69702",
    "Starter-Cron Bot: Tests scheduled messages. 0x4e58F676Fd4a4a6F9A99C79b3ddd2a2c133cE1C4",
    "Starter-Heartbeat Bot: Tests the heartbeat and reliability of the system. 0x3E4EFc2B2Ee3fCE01433F2E75021eeACd62CA94f",
  ];

  // Function to send bot and frame information
  const sendBotAndFrameInfo = async () => {
    const fullBotDescriptions = botInfo
      .map((value) => `- ${value}`)
      .join("\n\n");
    await context.reply(`Bots 🤖:\n\n${fullBotDescriptions}`);

    const testingBotsDescriptions = testingBotsInfo
      .map((value) => `- ${value}`)
      .join("\n\n");
    await context.reply(
      `Testing Bots (temporary)👨🏼‍💻:\n\n${testingBotsDescriptions}`
    );

    const framesMessage =
      `Also, explore these Frames compatible with Open Frames 🖼️:\n\n` +
      frameUrls.map((url) => `- ${url}`).join("\n\n") +
      `\n\nDiscover more frames in Awesome Open Frames https://github.com/open-frames/awesome-open-frames ✨.`;
    await context.reply(framesMessage);
  };

  // If it's the user's first message or they ask for the list, show the bot and frame info
  if (!step || content?.toLowerCase().includes("list")) {
    if (!step) {
      await context.reply(
        `Welcome to the Awesome XMTP Bot. Explore bots and frames from the ecosystem. Imagine it as the app store for chat apps 🤖🖼️`
      );
      inMemoryCache.set(senderAddress, 1); // Set the step to indicate the user has interacted
    }
    await sendBotAndFrameInfo();
  } else {
    // If the user sends another message, offer to show the list again
    await context.reply(
      "👋 Feel free to type 'list' anytime you want to dive back into the wonders of the XMTP ecosystem! 🌌"
    );
  }
});
