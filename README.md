<p align="center"><a  href="https://twitter.com/algoworld_nft/status/1450608110268211203"><img  width=100%  src="https://imgur.com/Sv4A6cq.png"  alt="687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67"  border="0" /></a></p>

<p align="center">
    <a href="https://algorand.com"><img src="https://img.shields.io/badge/Powered by-Algorand-blue.svg" /></a>
    <a href="https://algoworld.io"><img src="https://img.shields.io/badge/AlgoWorld-Website-pink.svg" /></a>
    <a href="https://algoworldexplorer.io"><img src="https://img.shields.io/badge/AlgoWorldExplorer-Platform-red.svg" /></a>
    <a><img src="https://visitor-badge.glitch.me/badge?page_id=AlgoWorldNFT.algoworld-contracts&right_color=green" /></a>

</p>

## 📃 About

The following repository hosts the source codes for `AlgoWorld Swapper`. Simple and open-source swapper that allows for trustless transfers of assets on Algorand blockchain and extensibility.

_**⚠️ NOTE: [algoworld-contracts](https://github.com/AlgoWorldNFT/algoworld-contracts) are not formally audited by accredited third parties. However, contracts are a basis for certain functionality on the AlgoWorldExplorer.io platform and were created in collaboration with Solution Architect from Algorand (credits @cusma).**_

- [📃 About](#---about)
- [✔ Prerequisites](#prerequisites)
- [🚀 Overview](#---overview)
- [⚙️ Development guide](#---development-guide)
- [🧪 Testing](#---testing)
- [📜 License](#---license)
- [⭐️ Stargazers](#---stargazers)

## Prerequisites

- `Node` >= 14.x
- `yarn` >= 1.12.15

## 🚀 Overview

AlgoWorld Swapper currently offers usage of several smart signatures used for single and multi ASA transfers.

### Swapper

There are two different types of smart signatures available:

- [ASA to ASA swap | 🎴↔️🎴](src/swapper/asa_to_asa_swapper.py): <br> Allows performing a swap of any single ASA of specified amount to any other single ASA of specified amount.

- [ASAs to ALGO swap | 🎴🎴🎴↔️💰](src/swapper/asas_to_algo_swapper.py): <br> Allows performing a swap of multiple ASAs of specified amount to ALGO of specified amount.

## ⚙️ Development guide

To start the project locally, run:

```bash
vercel dev
```

Open `http://localhost:3000` with your browser to see the result.

### Directory Structure

- [`.github`](.github) — GitHub configuration including the CI workflow.<br>
- [`.husky`](.husky) — Husky configuration and hooks.<br>
- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles.

### Scripts

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
## 🧪 Testing

TBD
## 📜 License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE.md) file for more information.

## ⭐️ Stargazers

Special thanks to everyone who forked or starred the repository ❤️

[![Stargazers repo roster for @AlgoWorldNFT/algoworld-swapper](https://reporoster.com/stars/dark/AlgoWorldNFT/algoworld-swapper)](https://github.com/AlgoWorldNFT/algoworld-swapper/stargazers)

[![Forkers repo roster for @AlgoWorldNFT/algoworld-swapper](https://reporoster.com/forks/dark/AlgoWorldNFT/algoworld-swapper)](https://github.com/AlgoWorldNFT/algoworld-swapper/network/members)
