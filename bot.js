const mineflayer = require('mineflayer');
const { auth } = require('minecraft-launcher-core');

// Configuration
const config = {
  host: 'Cp6042.aternos.me',
  port: 36907,
  username: 'Onlinebot247', // Bot's in-game username
  version: '1.20.4',
  auth: 'offline', // Using offline mode for private servers
  viewDistance: 'tiny',
  chat: 'enabled'
};

let bot;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // Microsoft authentication

async function authenticate() {
  // No authentication needed for offline mode
  return new Promise((resolve) => {
    console.log('✅ Using offline mode for authentication');
    resolve('offline-token');
  });

  /* Microsoft authentication (commented out for offline mode)
  try {
    const token = await auth({
      username: config.username,
      password: config.password,
      authTitle: '00000000402b5328', // Minecraft Launcher Client ID
      token: true,
      userType: 'msa'
    });
    return token.access_token;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('Please make sure your Microsoft credentials are correct.');
    process.exit(1);
  }
  */
}

async function createBot() {
  try {
    const accessToken = await authenticate();
    bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      version: config.version,
      auth: config.auth,
      viewDistance: config.viewDistance,
      chat: config.chat
    });

    // Event handlers
    bot.once('login', () => {
      console.log(`✅ Logged in as ${bot.username}`);
      reconnectAttempts = 0; // Reset reconnect attempts on successful login
    });

    bot.on('spawn', () => {
      console.log('✅ Spawned in world');
      bot.chat('Hello! I am online and ready!');
      
      // Optional: Enable 3D visualization in browser (requires prismarine-viewer)
      // mineflayerViewer(bot, { port: 3000, firstPerson: false });
    });

    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      console.log(`💬 ${username}: ${message}`);
      
      // Example: Respond to specific messages
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        bot.chat(`Hello ${username}!`);
      }
    });

    bot.on('kicked', (reason) => {
      console.log(`❌ Kicked: ${JSON.stringify(reason)}`);
      handleReconnect();
    });

    bot.on('error', (err) => {
      console.error('❌ Bot error:', err.message);
      // Don't reconnect on authentication errors
      if (err.message.includes('auth') || err.message.includes('login')) {
        console.error('Authentication error. Please check your credentials.');
        process.exit(1);
      }
      handleReconnect();
    });

    bot.on('end', () => {
      console.log('🔌 Connection ended');
      handleReconnect();
    });

    // Handle server messages (like "You need to be whitelisted")
    bot.on('message', (message) => {
      const msg = message.toString();
      if (msg.includes('whitelist') || msg.includes('banned') || msg.includes('kick')) {
        console.log(`⚠️ Server message: ${msg}`);
      }
    });

  } catch (error) {
    console.error('❌ Failed to create bot:', error.message);
    handleReconnect();
  }
}

// Handle reconnection with exponential backoff
function handleReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error(`❌ Max reconnection attempts (${maxReconnectAttempts}) reached. Exiting...`);
    process.exit(1);
  }

  const delay = Math.min(reconnectDelay * Math.pow(1.5, reconnectAttempts), 300000); // Cap at 5 minutes
  reconnectAttempts++;
  
  console.log(`⏳ Reconnecting in ${delay/1000} seconds... (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
  
  // Clear any existing bot instance
  if (bot) {
    bot.end('reconnecting');
    bot = null;
  }
  
  setTimeout(createBot, delay);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...');
  if (bot) bot.quit('shutdown');
  process.exit(0);
});

// Start the bot
console.log('🚀 Starting Minecraft bot...');
createBot();