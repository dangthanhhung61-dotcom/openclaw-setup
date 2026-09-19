<div align="center">

# 🦞 OpenClaw Setup

<p align="center">
  <a href="https://github.com/dangthanhhung61-dotcom/openclaw-setup"><img src="https://img.shields.io/badge/SOURCE-v5.16.8-0EA5E9?style=for-the-badge" alt="Source 5.16.8" /></a>
  <a href="https://github.com/tuanminhhole/openclaw-setup?tab=MIT-1-ov-file"><img src="https://img.shields.io/badge/LICENSE-MIT-success?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/create-openclaw-bot"><img src="https://img.shields.io/npm/v/create-openclaw-bot?style=for-the-badge&label=CLI&color=2563EB&logo=npm&logoColor=white" alt="NPM Version" /></a>
  <a href="https://github.com/tuanminhhole/openclaw-setup/stargazers"><img src="https://img.shields.io/github/stars/tuanminhhole/openclaw-setup?style=for-the-badge&color=eab308&logo=github&logoColor=white" alt="GitHub Stars" /></a>
</p>

[![Tiếng Việt](https://flagcdn.com/20x15/vn.png) Tiếng Việt](README.vi.md) · ![English](https://flagcdn.com/20x15/gb.png) **English**

> 💡 Open-source & free. A management dashboard that automates project scaffolding, deployment, and control for AI bots on **Telegram · Zalo** (Discord & Lark soon) — set up in minutes, no coding needed.

</div>

---

## ✨ Features

- 🤖 **Multi-Channel** — Telegram (single or multi-bot relay), Zalo Bot API and Zalo Personal; Discord & Lark coming soon.
- 🧑‍🤝‍🧑 **Multi-Bot Team** — Run multiple Telegram/Zalo bots simultaneously with synchronized workspaces and teamwork.
- 🧠 **Unified AI Routing via 9Router** — Easily route messages to Google Gemini, Claude, GPT-4o, OpenRouter, and Ollama (local offline models).
- 🧩 **Built-in Skills** — Web Search, Browser Automation (Chrome CDP), and Cron/Scheduler tasks.
- 🔌 **Integrated Marketplace** — Install advanced plugins such as `openclaw-zalo-mod` with a single click.
- 🔀 **9Router Integration** — Open-source OAuth-based AI proxy that gets you up and running for free without individual API keys.
- 🔒 **Safe & Private** — All configurations and API keys are stored locally on your own machine.

---

## 🗺️ Quick Start

### 1️⃣ Method 1 — npm release

Open your terminal and run this single command (works on macOS, Linux & Windows — needs Node.js 24 LTS):

```bash
npx create-openclaw-bot
```

It downloads the wizard, starts the local server, and opens the Setup UI in your browser at **http://127.0.0.1:51789**.
> The npm release may not include 5.16.8 yet. Use Method 2 for the latest GitHub installer.

### 2️⃣ Method 2 — Run the newest GitHub source (recommended for 5.16.8)

Use this if you specifically want the newest code directly from GitHub:

```bash
npx --yes github:dangthanhhung61-dotcom/openclaw-setup
```

> **Git is required for this method.** Install [Git](https://git-scm.com/downloads) and make sure the `git` command works in your terminal first; otherwise npm cannot download the GitHub repository.

### 3️⃣ Method 3 — Manual clone (for developers)

For contributors who want the full source. Run each line in order:

```bash
git clone https://github.com/dangthanhhung61-dotcom/openclaw-setup.git
cd openclaw-setup
npm install
npm start
```

Then open **http://127.0.0.1:51789** if the browser doesn't open by itself.

> ⚠️ `npm install` / `npm start` only work **inside the cloned `openclaw-setup` folder**. If you used either npx method, simply run the same npx command again when you want to reopen Setup.

### 🔁 Reopen the UI later

Run the recommended command again. Setup detects and reopens your existing project:

```bash
npx create-openclaw-bot
```

### ⬆️ Update to the newest version

Click **Update** in the **top-right corner of the Setup interface**. It downloads the newest version and restarts the UI automatically; the current browser tab reconnects on its own.

---

## 📋 System Prerequisites

- **Node.js 24 LTS** (required) — the Setup wizard itself runs on Node, so it's needed for **both** Docker and Native modes. [Download Node.js](https://nodejs.org/).
  OpenClaw is pinned to **2026.9.4**, which requires **Node.js 24.16.0+ (24.x)** or **26.1.0+**. Node.js 22 and 25 are not supported. The generated OpenClaw Docker image uses `node:24-slim`.
- **Git**: Installed and available in your environment PATH.
- **Docker Desktop** (recommended, for the bot runtime): Docker Compose V2. [Download Docker](https://www.docker.com/products/docker-desktop/).
- **Windows + Docker**: use the WSL2 backend and enable Developer Mode or launch the installer from an Administrator terminal to create the `.openclaw` link.

---

## 🚀 Step-by-step Setup Guide

> First time? Follow these in order — no terminal needed beyond opening the UI.

**1. Open the Setup UI** — run the install command above; the dashboard opens in your browser.

**2. Pick OS & run mode** — first make sure [Node.js 24 LTS](https://nodejs.org/) is installed (the wizard runs on Node — needed for **both** modes). Then open the **Setup** tab, choose your OS and the run mode:
- **Docker** (recommended) — isolated, and lets you create **multiple projects/bots**. Also install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Native** — lighter, runs the bot directly on the host (no Docker needed).

**3. Project path & name** — enter a folder path and a project name (example name: `bot`), then click **Install**. Example paths:
- Windows: `D:\bot`
- macOS: `/Users/<you>/bot`
- Linux: `/home/<you>/bot`

**4. Log in to 9Router** — click **Open 9Router website**, then log in with the default password **`123456`**.

**5. Create an API key (9Router)** — in **Endpoints**, create a new API key. Then open your project folder → `openclaw.json` → scroll to the **`models`** section → paste the key into the empty `apiKey` field and save.

**6. Connect a provider (9Router)** — go to **Providers**, pick the provider you want; it connects automatically.

**7. Create the routing combo (9Router)** — go to **Combos**, create a combo named exactly **`smart-route`** and add the models it should route to.

**8. Create your bot** — back in the Setup UI, choose a channel, fill in the bot info + your personal info, then click **Create bot**.

**9. Restart & test** — restart the bot container, then message your bot to test it. 🎉

---

## 🧠 Supported AI Providers (via 9Router)

- [9Router GitHub](https://github.com/decolua/9router)

---

## 🔌 Supported Channels

- **Telegram**: Acquire your official Bot Token from `@BotFather`.
- **Zalo Bot API**: Obtain credentials from [developers.zalo.me](https://developers.zalo.me).
- **Zalo Personal**: Scan the QR authorization image displayed on the OpenClaw Dashboard.
- **Discord**: _Coming soon._
- **Lark**: _Coming soon._

---

## 📁 Repository Structure

```text
openclaw-setup/
|-- README.md                ← English documentation (You are here)
|-- README.vi.md             ← Vietnamese documentation
|-- package.json             ← NPM entry and runner scripts
|-- dist/                    ← Compiled Web UI and CLI bundles
`-- src/                     ← Source code (UI, local API backend, build tools)
```

---

## ❓ FAQ

<details>
<summary><b>How do I start or stop the bot?</b></summary>
You no longer need to type terminal commands! Simply access the Setup Web UI, navigate to the <b>Bot</b> tab, and use the interactive <b>Start / Stop / Recreate</b> buttons to manage your bot lifecycle.
</details>

<details>
<summary><b>Where do I edit the bot's persona and instructions?</b></summary>
You can edit them directly in your browser. Go to the <b>Bot</b> tab, scroll down to the <b>Bot file tree</b> section, and select the file you want to edit (e.g., `SOUL.md` or `AGENTS.md`). Click <b>Save</b> to apply changes instantly.
</details>

<details>
<summary><b>Can I change the AI model configuration later?</b></summary>
Yes. You can edit the config JSON directly via the integrated File Editor in the Web UI, or re-run the setup script pointing to your existing project folder.
</details>

---

## 🔗 Useful Links

- [OpenClaw Docs](https://openclaw.ai/docs)
- [9Router GitHub](https://github.com/decolua/9router)
- [Google AI Studio](https://aistudio.google.com/)
- [Telegram BotFather](https://t.me/BotFather)
- [Zalo Developer Platform](https://developers.zalo.me)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [ClawHub (Skills)](https://clawhub.com)

---

## ⭐ Repository Stars

<div align="center">

<a href="https://github.com/tuanminhhole/openclaw-setup/stargazers"><img src="https://img.shields.io/github/stars/tuanminhhole/openclaw-setup?style=for-the-badge&logo=github&color=eab308" alt="GitHub Stars" /></a>
<a href="https://github.com/tuanminhhole/openclaw-setup/forks"><img src="https://img.shields.io/github/forks/tuanminhhole/openclaw-setup?style=for-the-badge&logo=github&color=0ea5e9" alt="GitHub Forks" /></a>

</div>

---

## 🙏 Acknowledgments

- [OpenClaw](https://openclaw.ai) — Core AI Gateway framework
- [9Router](https://github.com/decolua/9router) — Open-source AI proxy (OAuth-based, no API keys)
- [ClawHub](https://clawhub.com) — Bot skills registry
- [TheSVG](https://thesvg.org) — High-quality SVG brand icons

---

## 🙌 Author & Contributing

Built by **[tuanminhhole (Kent)](https://github.com/tuanminhhole)** as an open gift for the community.
Suggestions and PRs are always welcome. If this saved you time, please ⭐ the repo so more people can find it!

---

## 🦞 OpenClaw Ecosystem (same author)

Companion repos to build a complete, self-running AI assistant:

**🚀 Setup & framework**
- [openclaw-setup](https://github.com/tuanminhhole/openclaw-setup) — *(this repo)* Set up free AI bots with OpenClaw + 9Router (Telegram/Zalo, Docker)
- [vietbrain](https://github.com/tuanminhhole/vietbrain) — Vietnamese "Second Brain" framework for Obsidian (AI-ready)

**🔌 Plugins (runtime)**
- [openclaw-telegram-multibot-relay](https://github.com/tuanminhhole/openclaw-telegram-multibot-relay) — Multibot Telegram relay, delegation & native cron reminders
- [openclaw-zalo-connect](https://github.com/tuanminhhole/openclaw-zalo-connect) — Personal Zalo channel/runtime with QR login, native mentions and group actions
- [openclaw-zalo-mod](https://github.com/tuanminhhole/openclaw-zalo-mod) — Zero-token Zalo group management (slash commands, anti-spam, warn, memory)
- [openclaw-browser-automation](https://github.com/tuanminhhole/openclaw-browser-automation) — Smart Search & Browser Automation

**🧩 Skills**
- [openclaw-learning-memory](https://github.com/tuanminhhole/openclaw-learning-memory) — Always-on memory context engine (injects curated MEMORY.md + USER.md into every turn, incl. groups)
- [openclaw-skill-infographic](https://github.com/tuanminhhole/openclaw-skill-infographic) — Infographic generation

---

<div align="center">
<sub>🦞 <b>openclaw-setup</b> · part of the <a href="https://github.com/tuanminhhole">tuanminhhole (Kent)</a> ecosystem · MIT License</sub>
</div>
