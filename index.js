const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Use local auth to stay logged in
const client = new Client({
    authStrategy: new LocalAuth(), 
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Show QR on terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan this QR with WhatsApp to log in.');
});

// Confirm bot is ready
client.on('ready', () => {
    console.log('✅ Bot is ready and always online!');
});

// Handle messages
client.on('message', async (msg) => {
    const message = msg.body.toLowerCase();
    const from = msg.from;

    console.log(`💬 Message from ${from}: ${message}`);

    switch (message) {
        case 'hi':
        case 'hello':
            await msg.reply('Hey! 👋 Welcome to the WhatsApp bot. Type `.menu` to get started!');
            break;

        case '.menu':
            await msg.reply(
                `📋 *Main Menu*:\n` +
                `1️⃣ Info\n` +
                `2️⃣ Help\n` +
                `3️⃣ Joke\n` +
                `4️⃣ Update\n\n` +
                `Please reply with the number (1-4) to choose.`
            );
            break;

        case '1':
            await msg.reply('ℹ️ This is a WhatsApp bot made using `whatsapp-web.js`. It’s smart, sassy, and always online.');
            break;

        case '2':
            await msg.reply('❓ Type `.menu` to view options. Type `hi` to restart the conversation. More features soon!');
            break;

        case '3':
            await msg.reply('😂 *Why don’t programmers like nature?* It has too many bugs.');
            break;

        case '4':
            await msg.reply('📢 *Latest Update*: Bot now supports menus, jokes, and stays online 24/7. New AI features coming soon!');
            break;

        default:
            await msg.reply('🤖 I didn’t catch that. Type `.menu` to see what I can do.');
            break;
    }
});

// Start the bot
client.initialize();
