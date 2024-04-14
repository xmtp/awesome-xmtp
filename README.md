# XMTP The General Store Bot

![](https://github.com/xmtp/awesome-xmtp/assets/1447073/9bb4f8c2-321e-4b6d-b52e-2105d69c4d47)

Bot for serving goodies at Hackathons. See you in the next one!

Message `thegeneralstore.eth` on XMTP to get started.

## Getting started

> ⚠️ Ensure you're using `Yarn 4` for dependency management. Check with `yarn --version`.

To install dependencies:

```bash
yarn
```

To run:

```bash
yarn build
yarn start
```

To run with hot-reload:

```bash
yarn build:watch
yarn start:watch
```

### Environment

```bash
cp .env.example .env
```

then populate the environment variables accordingly

```bash
KEY= # private key of the wallet controlling the bot
XMTP_ENV= # production or development
PUBLIC_BOT_ADDRESS= # Public address of the bot
HEARTBEAT_BOT_KEY= # Private key for the heartbeat mechanism for reliability
DEBUG= # Enable or disable debug mode (true or false)
```
