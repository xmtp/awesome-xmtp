import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import { GrpcApiClient } from "@xmtp/grpc-api-client";

export default async function createClient(): Promise<Client> {
  const key = process.env.KEY;

  if (!key) {
    throw new Error("KEY not set");
  }

  const wallet = new Wallet(key);

  if (process.env.XMTP_ENV !== "production" && process.env.XMTP_ENV !== "dev") {
    throw new Error("XMTP_ENV must be set to 'production' or 'dev'");
  }

  const client = await Client.create(wallet, {
    env: process.env.XMTP_ENV as any,
    apiClientFactory: GrpcApiClient.fromOptions,
  });

  // await client.publishUserContact();

  return client;
}
