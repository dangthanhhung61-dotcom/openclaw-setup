<div align="center">

# 🦞 OpenClaw Setup

<p align="center">
  <a href="https://github.com/dangthanhhung61-dotcom/openclaw-setup"><img src="https://img.shields.io/badge/SOURCE-v5.16.8-0EA5E9?style=for-the-badge" alt="Source 5.16.8" /></a>
  <a href="https://github.com/tuanminhhole/openclaw-setup?tab=MIT-1-ov-file"><img src="https://img.shields.io/badge/LICENSE-MIT-success?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/create-openclaw-bot"><img src="https://img.shields.io/npm/v/create-openclaw-bot?style=for-the-badge&label=CLI&color=2563EB&logo=npm&logoColor=white" alt="NPM Version" /></a>
  <a href="https://github.com/tuanminhhole/openclaw-setup/stargazers"><img src="https://img.shields.io/github/stars/tuanminhhole/openclaw-setup?style=for-the-badge&color=eab308&logo=github&logoColor=white" alt="GitHub Stars" /></a>
</p>

![Tiếng Việt](https://flagcdn.com/20x15/vn.png) **Tiếng Việt** · [![English](https://flagcdn.com/20x15/gb.png) English](README.md)

> 🇻🇳 Mã nguồn mở & miễn phí. Dashboard tự động hóa việc tạo dự án, triển khai và quản lý bot AI trên **Telegram · Zalo** (Discord & Lark sắp ra mắt) — cài trong vài phút, không cần biết code.

</div>

---

## ✨ Tính năng nổi bật

- 🤖 **Đa kênh** — Telegram (1 hoặc nhiều bot), Zalo Bot API và Zalo Personal (Cá nhân); Discord & Lark sắp ra mắt.
- 🧑‍🤝‍🧑 **Đội bot (Multi-bot Team)** — Chạy đồng thời nhiều bot Telegram/Zalo, tự động đồng bộ hóa tài liệu và phối hợp làm việc theo nhóm.
- 🧠 **Đa nhà cung cấp AI qua 9Router** — Dễ dàng định tuyến đến Google Gemini, Claude, GPT-4o, OpenRouter, Ollama (chạy local offline).
- 🧩 **Kỹ năng (Skills)** — Web Search, Browser Automation (Chrome CDP thực tế), Cron/Scheduler lập lịch.
- 🔌 **Plugin tích hợp** — Cài đặt nhanh các plugin nâng cao như `openclaw-zalo-mod` chỉ bằng 1 nút nhấn trên UI.
- 🔀 **9Router tích hợp** — Cầu nối AI proxy miễn phí không cần API key thông qua đăng nhập OAuth.
- 🔒 **An toàn & Riêng tư** — Toàn bộ cấu hình và API key chỉ lưu trên thiết bị của bạn.

---

## 🗺️ Cách cài đặt nhanh nhất

### 1️⃣ Cách 1 — Bản phát hành trên npm

Mở terminal và chạy đúng một lệnh (chạy trên macOS, Linux & Windows — cần Node.js 24 LTS):

```bash
npx create-openclaw-bot
```

Lệnh này tự tải wizard, chạy server và **mở giao diện Setup** trên trình duyệt tại **http://127.0.0.1:51789**.
> Bản trên npm có thể chưa phải 5.16.8; để dùng bản GitHub mới nhất, chạy Cách 2 bên dưới.

### 2️⃣ Cách 2 — Chạy mã mới nhất trực tiếp từ GitHub (khuyên dùng cho 5.16.8)

Dùng cách này nếu bạn muốn lấy code mới nhất trực tiếp từ GitHub:

```bash
npx --yes github:dangthanhhung61-dotcom/openclaw-setup
```

> **Cách này bắt buộc máy phải cài Git.** Hãy cài [Git](https://git-scm.com/downloads) và kiểm tra lệnh `git` chạy được trong terminal trước; nếu thiếu Git, npm không thể tải repository từ GitHub.

### 3️⃣ Cách 3 — Clone thủ công (dành cho developer)

Dành cho người muốn lấy full source. Chạy lần lượt từng dòng:

```bash
git clone https://github.com/dangthanhhung61-dotcom/openclaw-setup.git
cd openclaw-setup
npm install
npm start
```

Sau đó mở **http://127.0.0.1:51789** nếu trình duyệt không tự bật.

> ⚠️ `npm install` / `npm start` **chỉ chạy được khi bạn đang ở trong thư mục `openclaw-setup` đã clone**. Nếu dùng một trong hai cách npx, lần sau chỉ cần chạy lại đúng lệnh npx đó để mở Setup.

### 🔁 Mở lại giao diện sau này

Chạy lại lệnh khuyên dùng. Setup sẽ tự nhận diện và mở project hiện có:

```bash
npx create-openclaw-bot
```

### ⬆️ Cập nhật lên phiên bản mới

Bấm nút **Cập nhật** ở **góc trên bên phải giao diện Setup**. Hệ thống tự tải phiên bản mới và khởi động lại UI; tab đang mở sẽ tự kết nối lại.

---

## 📋 Yêu cầu hệ thống

- **Node.js 24 LTS** (bắt buộc) — wizard Setup chạy bằng Node, nên cần cho **cả** chế độ Docker lẫn Native. [Tải Node.js](https://nodejs.org/).
  OpenClaw được ghim ở **2026.9.4**, yêu cầu **Node.js 24.16.0+ (nhánh 24)** hoặc **26.1.0+**. Không hỗ trợ Node.js 22 và 25. Image Docker OpenClaw được sinh ra dùng `node:24-slim`.
- **Git**: Đã cài đặt và có trong biến môi trường PATH.
- **Docker Desktop** (khuyên dùng, để chạy bot): hỗ trợ Docker Compose V2. [Tải Docker](https://www.docker.com/products/docker-desktop/).
- **Windows + Docker**: dùng backend WSL2; bật Developer Mode hoặc chạy terminal cài đặt bằng quyền Administrator để tạo liên kết `.openclaw` tới volume Linux.

---

## 🚀 Hướng dẫn cài đặt từng bước

> Lần đầu dùng? Làm lần lượt theo thứ tự — không cần gõ terminal ngoài bước mở giao diện.

**1. Mở giao diện Setup** — chạy lệnh cài ở trên, dashboard sẽ mở trên trình duyệt.

**2. Chọn Hệ điều hành & Chế độ chạy** — cài [Node.js 24 LTS](https://nodejs.org/) trước (wizard chạy bằng Node — cần cho **cả 2** chế độ). Rồi vào tab **Cài đặt**, chọn hệ điều hành và chế độ chạy:
- **Docker** (khuyên dùng) — chạy cách ly và **tạo được nhiều project/bot**. Cài thêm [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Native** — nhẹ hơn, chạy bot thẳng trên máy (không cần Docker).

**3. Nhập đường dẫn & tên project** — nhập đường dẫn thư mục và tên project (ví dụ tên: `bot`), rồi bấm **Cài đặt**. Ví dụ đường dẫn:
- Windows: `D:\bot`
- macOS: `/Users/<tên-bạn>/bot`
- Linux: `/home/<tên-bạn>/bot`

**4. Đăng nhập 9Router** — bấm nút **Mở website 9Router**, đăng nhập bằng mật khẩu mặc định **`123456`**.

**5. Tạo API key (9Router)** — vào mục **Endpoints**, tạo một API key mới. Sau đó mở thư mục project → file `openclaw.json` → kéo xuống mục **`models`** → dán key vào ô `apiKey` còn trống rồi lưu.

**6. Kết nối Provider (9Router)** — vào mục **Providers**, chọn provider bạn muốn; hệ thống tự kết nối.

**7. Tạo Combo định tuyến (9Router)** — vào mục **Combos**, tạo combo đặt tên **đúng** là **`smart-route`** và thêm các models cần dùng.

**8. Tạo bot** — quay lại giao diện Setup, chọn kênh, nhập thông tin bot + thông tin cá nhân, rồi bấm **Tạo bot**.

**9. Restart & test** — khởi động lại container bot, rồi nhắn tin cho bot để kiểm tra. 🎉

---

## 🧠 Các Provider AI được hỗ trợ (Thông qua 9Router)

- [9Router GitHub](https://github.com/decolua/9router)

---

## 🔌 Kênh trò chuyện hỗ trợ

- **Telegram**: Lấy token bot chính thức từ `@BotFather`.
- **Zalo Bot API**: Lấy thông tin kết nối chính thức từ [developers.zalo.me](https://developers.zalo.me).
- **Zalo Cá nhân (Zalo Personal)**: Kích hoạt cực nhanh bằng cách quét mã QR hiển thị ngay trên Dashboard OpenClaw.
- **Discord**: _Sắp ra mắt._
- **Lark**: _Sắp ra mắt._

---

## 📁 Cấu trúc thư mục dự án

```text
openclaw-setup/
|-- README.md                ← Tài liệu tiếng Anh
|-- README.vi.md             ← Hướng dẫn tiếng Việt (Bạn đang đọc)
|-- package.json             ← Điểm cấu hình NPM và scripts khởi chạy
|-- dist/                    ← Mã nguồn đã biên dịch của Web UI và CLI
`-- src/                     ← Mã nguồn gốc (giao diện, máy chủ cục bộ API, script build)
```

---

## ❓ Câu hỏi thường gặp

<details>
<summary><b>Làm thế nào để dừng hoặc chạy lại bot?</b></summary>
Giờ đây bạn không cần gõ lệnh nữa! Chỉ cần mở Web UI Setup lên, truy cập tab <b>Bot</b> và sử dụng nút bấm <b>Start / Stop / Recreate</b> để quản lý trực quan tiến trình hoạt động của Bot.
</details>

<details>
<summary><b>Sửa tính cách bot và danh sách tác vụ ở đâu?</b></summary>
Bạn có thể sửa trực tiếp ngay trên trình duyệt bằng cách truy cập tab <b>Bot</b>, cuộn xuống phần <b>Bot file tree</b> và click chọn file cần sửa (ví dụ: `SOUL.md`, `AGENTS.md`). Sau khi sửa xong nhấn <b>Save</b> là cấu hình sẽ được cập nhật ngay lập tức.
</details>

<details>
<summary><b>Tôi có thể đổi model AI sau khi cài không?</b></summary>
Hoàn toàn được. Bạn có thể sửa trực tiếp file `openclaw.json` ở giao diện web của setup, hoặc chạy lại lệnh cài đặt trỏ vào thư mục cũ để cập nhật nhanh cấu hình.
</details>

---

## 🔗 Liên kết hữu ích

- [OpenClaw Docs](https://openclaw.ai/docs)
- [9Router GitHub](https://github.com/decolua/9router)
- [Google AI Studio](https://aistudio.google.com/)
- [Telegram BotFather](https://t.me/BotFather)
- [Zalo Developer Platform](https://developers.zalo.me)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [ClawHub (Skills)](https://clawhub.com)

---

## ⭐ Sao của repository

<div align="center">

<a href="https://github.com/tuanminhhole/openclaw-setup/stargazers"><img src="https://img.shields.io/github/stars/tuanminhhole/openclaw-setup?style=for-the-badge&logo=github&color=eab308" alt="GitHub Stars" /></a>
<a href="https://github.com/tuanminhhole/openclaw-setup/forks"><img src="https://img.shields.io/github/forks/tuanminhhole/openclaw-setup?style=for-the-badge&logo=github&color=0ea5e9" alt="GitHub Forks" /></a>

</div>

---

## 🙏 Lời cảm ơn

- [OpenClaw](https://openclaw.ai) — AI Gateway framework
- [9Router](https://github.com/decolua/9router) — Open-source AI proxy (OAuth-based, no API keys)
- [ClawHub](https://clawhub.com) — Kho đăng ký các kỹ năng của bot
- [TheSVG](https://thesvg.org) — Kho biểu tượng nhãn hiệu SVG chất lượng cao

---

## 🙌 Tác giả & Đóng góp

Làm bởi **[tuanminhhole (Kent)](https://github.com/tuanminhhole)** như một món quà mở cho cộng đồng.
Mọi góp ý / PR cải tiến đều được hoan nghênh. Nếu thấy hữu ích, hãy ⭐ repo để nhiều người biết tới nhé!

---

## 🦞 Hệ sinh thái OpenClaw (cùng tác giả)

Các repo đi kèm để bạn dựng một trợ lý AI "tự vận hành" hoàn chỉnh:

**🚀 Cài đặt & khung nền**
- [openclaw-setup](https://github.com/tuanminhhole/openclaw-setup) — *(repo này)* Setup bot AI miễn phí bằng OpenClaw + 9Router (Telegram/Zalo, Docker)
- [vietbrain](https://github.com/tuanminhhole/vietbrain) — Bộ khung "Bộ Não Thứ Hai" tiếng Việt cho Obsidian (sẵn sàng AI)

**🔌 Plugin (runtime)**
- [openclaw-telegram-multibot-relay](https://github.com/tuanminhhole/openclaw-telegram-multibot-relay) — Multibot Telegram relay, delegation & cron nhắc lịch native
- [openclaw-zalo-connect](https://github.com/tuanminhhole/openclaw-zalo-connect) — Channel/runtime Zalo cá nhân với đăng nhập QR, mention native và thao tác nhóm
- [openclaw-zalo-mod](https://github.com/tuanminhhole/openclaw-zalo-mod) — Quản lý nhóm Zalo zero-token (slash command, anti-spam, warn, memory)
- [openclaw-browser-automation](https://github.com/tuanminhhole/openclaw-browser-automation) — Smart Search & Browser Automation

**🧩 Skill**
- [openclaw-learning-memory](https://github.com/tuanminhhole/openclaw-learning-memory) — Context engine trí nhớ always-on (nạp MEMORY.md + USER.md vào mọi lượt, kể cả nhóm)
- [openclaw-skill-infographic](https://github.com/tuanminhhole/openclaw-skill-infographic) — Tạo infographic

---

<div align="center">
<sub>🦞 <b>openclaw-setup</b> · một phần của hệ sinh thái <a href="https://github.com/tuanminhhole">tuanminhhole (Kent)</a> · MIT License</sub>
</div>
