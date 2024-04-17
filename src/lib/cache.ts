import HandlerContext from "./handler-context";

/**
 * Updates or initializes the cache entry for a given sender.
 *
 * This function checks if a sender's message contains any stop words, if the last interaction
 * was more than an hour ago, or simply updates the last interaction time. It also handles resetting
 * the interaction step based on these conditions.
 *
 * @param senderAddress The address of the message sender.
 * @param content The content of the message.
 * @param stopWords An array of words that trigger a reset in interaction step.
 * @returns An object containing the updated step, last interaction timestamp, and a reset flag.
 */
export const updateCacheForSender = (
  inMemoryCache: Map<string, { step: number; lastInteraction: number }>,
  senderAddress: string,
  content: string,
  stopWords: string[]
) => {
  const oneHour = 3600000; // Milliseconds in one hour.
  const now = Date.now(); // Current timestamp.
  const cacheEntry = inMemoryCache.get(senderAddress); // Retrieve the current cache entry for the sender.

  let reset = false; // Flag to indicate if the interaction step has been reset.
  const defaultStopWords = ["stop", "unsubscribe", "cancel"];
  const combinedStopWords = [...new Set([...stopWords, ...defaultStopWords])];
  if (combinedStopWords.some((word) => content.toLowerCase().includes(word))) {
    // If its a stop word
    reset = true;
  }
  if (!cacheEntry || now - cacheEntry.lastInteraction > oneHour) {
    // If there's no cache entry or the last interaction was more than an hour ago, reset the step.
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
  return inMemoryCache.get(senderAddress)!.step;
};
