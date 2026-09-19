
# 🟢 Minecraft 24/7 Bot

A simple bot built with [mineflayer](https://github.com/PrismarineJS/mineflayer) that connects to a Minecraft server and stays online 24/7. Great for keeping your slot active on a private or offline server.

---

## ⚙️ Features

- Connects to any Minecraft server (offline or online mode)
- Stays online 24/7 with automatic reconnection
- Sends a greeting message when joining
- Responds to players in chat (example: responds to "hello" or "hi")
- Handles kicks, bans, and whitelist messages gracefully
- Microsoft login support (optional)

---

## 🚀 Setup Instructions

### 1. Install Node.js
Download and install from: https://nodejs.org/

### 2. Download or Clone This Project
You can download this folder from MediaFire or clone from GitHub (if applicable).

### 3. Install Dependencies
Open a terminal or CMD in the folder, then run:

```bash
npm install
```

### 4. Configure the Bot
Edit the `bot.js` file and update the `config` object at the top:

```js
const config = {
  host: 'your.server.ip',
  port: 25565,
  username: 'YourBotName',
  version: '1.20.4',
  auth: 'offline', // Use 'microsoft' for Microsoft accounts
  viewDistance: 'tiny',
  chat: 'enabled'
};
```

### 5. (Optional) Microsoft Login
If you're using a Microsoft account (premium), uncomment the Microsoft authentication code in `bot.js` and create a `.env` file:

```env
MC_USERNAME=your-email@example.com
MC_PASSWORD=your-password
```

---

## ▶️ Run the Bot

```bash
node bot.js
```

The bot will automatically attempt to reconnect if disconnected or kicked (up to 5 times).

---

## ❗ Important Notes

- **Do not share your `.env` file or credentials with anyone.**
- Only use this bot on servers that allow automated clients or bots.
- This bot works best on **private or offline-mode servers**.
- Using it on public servers (like Hypixel) may result in bans or violate their terms.

---

## 🛑 Troubleshooting

- **"Authentication error"** → Check your login credentials.
- **"Kicked or banned"** → Your server may not allow bots.
- **Not connecting?** → Make sure the `host`, `port`, and `version` are correct.

---

## 📄 License

This bot is open-source and provided for educational and private use only. Use at your own risk.
