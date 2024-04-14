import { DecodedMessage } from "@xmtp/xmtp-js";

export default class HandlerContext {
  message: DecodedMessage;

  constructor(message: DecodedMessage) {
    this.message = message;
  }

  async reply(content: any) {
    await this.message.conversation.send(content);
  }
}
