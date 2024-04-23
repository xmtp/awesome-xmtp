import "dotenv/config";
import HandlerContext from "./lib/handler-context";
import run from "./lib/runner.js";

const inMemoryCache = new Map<
  string,
  { step: number; lastInteraction: number }
>();
run(async (context: HandlerContext) => {
  const { message } = context;
  const { content, senderAddress } = message;

  const oneHour = 3600000; // Milliseconds in one hour.
  const now = Date.now(); // Current timestamp.
  const cacheEntry = inMemoryCache.get(senderAddress); // Retrieve the current cache entry for the sender.

  let reset = false; // Flag to indicate if the interaction step has been reset.
  const defaultStopWords = ["stop", "unsubscribe", "cancel"];
  if (defaultStopWords.some((word) => content.toLowerCase().includes(word))) {
    // If its a stop word
    reset = true;
  }

  if (reset) {
    inMemoryCache.delete(senderAddress);
    //context.reply(deleteMsg);
  }
  // Update the cache entry with either reset step or existing step, and the current timestamp.
  inMemoryCache.set(senderAddress, {
    step: reset ? 0 : cacheEntry?.step ?? 0,
    lastInteraction: now,
  });
  // Return the updated cache entry and the reset flag.
  const step = inMemoryCache.get(senderAddress)!.step;

  const botInfo = [
    "🚀 Trending Mints Bot trendingmints.eth : Subscribe to get real-time trending mints in Base through Airstack and mint through daily messages.",
    "💧 Faucet Bot faucetbot.eth : Delivers Faucet funds to devs on Testnet. Powered by Learnweb3.",
    "🤖 AI Docs Bot docs.hi.xmtp.eth : Chat with the XMTP Docs through an API with a GPT powered bot. Powered by Kapa.",
    "🛍️ TheGeneralStore store.hi.xmtp.eth : Bot for ordering goodies in hackathons.",
    "📅 Wordle a Day dailywordle.eth : Play daily through XMTP to the WORDLE game created by du8.",
    "🌟 Awesome Bot: awesome.hi.xmtp.eth : Learn everything about frames and bots.",
    "💬 Gpt Bot: gpt.hi.xmtp.eth : Chat with an AI powered bot.",
  ];

  // Function to send bot and frame information
  const sendBotAndFrameInfo = async () => {
    const fullBotDescriptions = botInfo
      .map((value) => `- ${value}`)
      .join("\n\n");
    await context.reply(`Bots 🤖:\n\n${fullBotDescriptions}`);

    await context.reply(
      `Discover more bots in Awesome XMTP https://github.com/xmtp/awesome-xmtp ✨.`
    );
  };
  // If it's the user's first message or they ask for the list, show the bot and frame info
  if (!step) {
    /*
    if (senderAddress === "0x277C0dd35520dB4aaDDB45d4690aB79353D3368b") {
      const testingBotsInfo = [
        "Starter Bot: A basic bot for initial testing. 0x61175cdB3cdC0459896e10Cce0A4Dab49FD69702",
        "Starter-Cron Bot: Tests scheduled messages. 0x4e58F676Fd4a4a6F9A99C79b3ddd2a2c133cE1C4",
        "Starter-Heartbeat Bot: Tests the heartbeat and reliability of the system. 0x3E4EFc2B2Ee3fCE01433F2E75021eeACd62CA94f",
      ];
      const testingBotsDescriptions = testingBotsInfo
        .map((value) => `- ${value}`)
        .join("\n\n");
      await context.reply(
        `Testing Bots (temporary)👨🏼‍💻:\n\n${testingBotsDescriptions}`
      );
    }*/

    await context.reply(
      `Welcome to the Awesome XMTP Bot. Explore bots and frames from the ecosystem. Imagine it as the app store for chat apps 🤖🖼️`
    );
    inMemoryCache.set(senderAddress, {
      step: 1,
      lastInteraction: Date.now(),
    });

    await sendBotAndFrameInfo();
    return;
  } else if (step == 1) {
    context.reply(
      "👋 Feel free to type 'list' anytime you want to dive back into the wonders of the XMTP ecosystem! 🌌"
    );
    return;
  }
});
