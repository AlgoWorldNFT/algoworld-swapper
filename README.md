<p align="center"><img  width=100%  src="https://imgur.com/Sv4A6cq.png"  alt="687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67"  border="0" /></p>

<p align="center">
    <a href="https://algorand.com"><img src="https://img.shields.io/badge/Powered by-Algorand-black.svg" /></a>
    <a href="https://algoworld.io"><img src="https://img.shields.io/badge/AlgoWorld-Website-purple.svg" /></a>
    <a href="https://github.com/MShawon/github-clone-count-badge"><img src="https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://gist.githubusercontent.com/aorumbayev/ec038d0e28f865f4056bdf69af201b78/raw/clone.json&logo=github" /></a>
    <br/>
    <a href="https://github.com/AlgoWorldNFT/algoworld-swapper/actions/workflows/release.yml"><img src="https://github.com/AlgoWorldNFT/algoworld-swapper/actions/workflows/release.yml/badge.svg?branch=main" /></a>
    <a href="https://algoworldexplorer.io"><img src="https://img.shields.io/badge/AlgoWorldExplorer-Platform-orange.svg" /></a>
    <a><img src="https://visitor-badge.glitch.me/badge?page_id=AlgoWorldNFT.algoworld-swapper&right_color=blue" /></a>
</p>

## 📃 About

The following repository hosts the source codes for `AlgoWorld Swapper`. Free and open-source swapper that allows for trustless transfers of assets on Algorand blockchain and extensibility.

> _**⚠️ NOTE: [algoworld-contracts](https://github.com/AlgoWorldNFT/algoworld-contracts) used by the swapper are not formally audited by accredited third parties. However, contracts are a basis for certain functionality on the AlgoWorldExplorer.io platform and were created in collaboration with Solution Architect from Algorand (credits @cusma).**_

---

## Prerequisites

- `Node` >= 14.x
- `yarn` >= 1.12.15
- `vercel cli` >= 24.2.4
- [`pre-commit`](https://pre-commit.com/) >= 2.19.0

### `pre-commit` configuration

Run the following command from the root of the repo to setup hooks:

```bash
pre-commit install # for all hooks
pre-commit install --hook-type commit-msg # for commitlint checks
```

---

## 🚀 Overview

AlgoWorld Swapper currently offers usage of several smart signatures used for single and multi ASA transfers.

### Swapper

There are two different types of smart signatures available:

- **ASA to ASA swap | 🎴↔️🎴**: <br> Allows performing a swap of any single ASA of specified amount to any other single ASA of specified amount.

- **ASAs to ALGO swap | 🎴🎴🎴↔️💰**: <br> Allows performing a swap of multiple ASAs of specified amount to ALGO of specified amount.

> Detailed documentation is work in progress ⚠️

---

## ⚙️ Development guide

To start the project locally, run:

```bash
vercel dev
```

Open `http://localhost:3000` with your browser to see the result.

> Running `vercel dev` for the first time will prompt you to setup and link with your existing/new vercel project. You can create a dummy project and link it to be able to run the development locally.

### Env variables

For running locally create a file called `.env.local` and fill it with the following default parameters (or replace with your own values):

| Variable Name                     | Required? | Description                                                                                   |
| --------------------------------- | :-------: | --------------------------------------------------------------------------------------------- |
| **AW_WEB_STORAGE_API_KEY**        |    yes    | obtain your own api key on [ web3.storage ](https://web3.storage/).                           |
| **NEXT_PUBLIC_CHAIN_TYPE**        |    yes    | set to `mainnet` or `testnet` to indicate which chain to use by default.                      |
| **NEXT_PUBLIC_GA_MEASUREMENT_ID** |    no     | a tag value for Google Analytics tracking. For local dev purposes you can skip it completely. |
| **NEXT_PUBLIC_SENTRY_DSN**        |    no     | a tag value for Sentry error tracking. For local dev purposes you can skip it completely.     |

### Directory Structure

- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles.
- [`api`](./api) — Serverless vercel functions, contract compilation is using `python` and `pyteal` and ipfs storage is done with `node`.
- [`.pre-commit-config.yaml`](.pre-commit-config.yaml) — pre commit coniguration for formatting python serverless functions.<br></br>

### Scripts

The section describes different modes of running the swapper for local dev purposes.

#### Client and functions

- `vercel dev` - executes both backend and frontend.

#### Frontend only

Below is for frontend client only (excluding `Vercel` serveless functions).

- `yarn dev` — Starts the application in development mode at `http://localhost:3000`.
- `yarn build` — Creates an optimized production build of your application.
- `yarn start` — Starts the application in production mode.
- `yarn type-check` — Validate code using TypeScript compiler.
- `yarn lint` — Runs ESLint for all files in the `src` directory.
- `yarn format` — Runs Prettier for all files in the `src` directory.
- `yarn commit` — Run commitizen. Alternative to `git commit`.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/Button';

// To import images or other files from the public folder
import avatar from '@/public/avatar.png';
```

---

## 🧪 Testing

TBD

---

## 📜 License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE.md) file for more information.

---

## ⭐️ Stargazers

Special thanks to everyone who forked or starred the repository ❤️

[![Stargazers repo roster for @AlgoWorldNFT/algoworld-swapper](https://reporoster.com/stars/dark/AlgoWorldNFT/algoworld-swapper)](https://github.com/AlgoWorldNFT/algoworld-swapper/stargazers)

[![Forkers repo roster for @AlgoWorldNFT/algoworld-swapper](https://reporoster.com/forks/dark/AlgoWorldNFT/algoworld-swapper)](https://github.com/AlgoWorldNFT/algoworld-swapper/network/members)
