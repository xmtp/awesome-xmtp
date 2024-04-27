import "dotenv/config";
import { run, HandlerContext } from "@xmtp/botkit";

import Mixpanel from "mixpanel";
const mixpanel = Mixpanel.init(process.env.MIX_PANEL as string);

const inMemoryCacheStep = new Map<string, number>();

run(async (context: HandlerContext) => {
  const { content, senderAddress } = context.message;

  const defaultStopWords = ["stop", "unsubscribe", "cancel", "list"];
  if (defaultStopWords.some((word) => content.toLowerCase().includes(word))) {
    inMemoryCacheStep.delete(senderAddress);
  }
  mixpanel.track("Awesome-Visit", {
    distinct_id: senderAddress,
  });
  const cacheStep = inMemoryCacheStep.get(senderAddress) || 0;

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
  if (cacheStep == 0) {
    await context.reply(
      `Welcome to the Awesome XMTP Bot. Explore bots and frames from the ecosystem. Imagine it as the app store for chat apps 🤖🖼️`
    );
    inMemoryCacheStep.set(senderAddress, 1);

    await sendBotAndFrameInfo();
    return;
  } else if (cacheStep == 1) {
    context.reply(
      "👋 Feel free to type 'list' anytime you want to dive back into the wonders of the XMTP ecosystem! 🌌"
    );
    return;
  }
});
