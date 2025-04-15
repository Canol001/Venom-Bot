const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    webVersion: '2.2412.54', // Stable WhatsApp Web version
    webVersionCache: { type: 'local' }
});

// Store bot's own WhatsApp ID
let botId = null;

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan the QR code above to log in.');
});

client.on('ready', () => {
    console.log('✅ Bot is online and vibing! 🔥');
    botId = client.info.wid._serialized;
    console.log(`Bot ID: ${botId}`);
});

// Function to send a random emoji reaction
async function sendRandomEmojiReaction(msg) {
    const emojis = [
        '😺', '🚀', '🌮', '👍', '🔥', '😎',
        '🦄', '🧠', '🥷', '🛸', '🦖', '🗿', '🌌',
        '🧃', '📟', '🧿', '📡', '🛠️', '🔮', '🕹️',
        '⚗️', '🛰️', '🥽', '🪄', '🎛️', '🧬', '🧱'
    ];
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
        await msg.react(randomEmoji);
        console.log(`Reacted with ${randomEmoji} to message in group: ${msg.from}`);
    } catch (error) {
        console.error('Error sending reaction:', error.message);
    }
}

client.on('message', async (msg) => {
    const message = msg.body.toLowerCase().trim();
    const chatId = msg.from;
    const isGroup = chatId.endsWith('@g.us');
    const isBotMentioned = botId ? msg.mentionedIds.includes(botId) : false;

    // Debug: Log message context
    console.log(`💬 ${chatId}: ${msg.body} | Group: ${isGroup} | Mentioned: ${isBotMentioned} | HasQuotedMsg: ${msg.hasQuotedMsg}`);

    // Handle group messages
    if (isGroup && !isBotMentioned) {
        await sendRandomEmojiReaction(msg);
        return;
    }

    // === EXISTING COMMANDS ===
    try {
        if (message === 'hi' || message === 'hello') {
            await msg.reply(`
👋 *Welcome to vBot AI Deluxe*  
Type \`.menu\` to explore 100+ features!  
🚀 Let's vibe with epic tools & tricks!
            `);
            return;
        }

        if (message === '.menu') {
            await msg.reply(`
📋 *Main Menu*  
Type the number or letter to choose a category:

1️⃣ Entertainment  
2️⃣ Productivity  
3️⃣ Developer Tools  
4️⃣ Quotes & Jokes  
5️⃣ AI & Fun  
6️⃣ Settings  
7️⃣ About  
8️⃣ Help  
9️⃣ Games  
🔟 Utilities
            `);
            return;
        }

        // === MAIN CATEGORIES ===
        switch (message) {
            case '1':
                await msg.reply(`
🎮 *Entertainment Zone*  
a. \`joke\` - Random joke  
b. \`meme\` - Random meme (via API)  
c. \`game\` - Surprise challenge  
d. \`quiz\` - Fun quiz  
e. \`riddle\` - Brain teaser  
f. \`trivia\` - Random trivia  
g. \`song\` - Song recommendation  
h. \`movie\` - Movie suggestion  
i. \`dance\` - Dance move generator  
j. \`story\` - Short story prompt  
k. \`emoji-story\` - Emoji-based story  
l. \`magic-trick\` - Virtual magic trick  
m. \`superhero\` - Create a superhero  
n. \`cartoon\` - Cartoon character quiz  
o. \`prank\` - Harmless prank idea
                `);
                break;

            case '2':
                await msg.reply(`
📈 *Productivity Tools*  
a. \`todo\` - Manage tasks  
b. \`reminder\` - Set a reminder  
c. \`note\` - Save a note  
d. \`clock\` - Show time & date  
e. \`timer\` - Start a timer  
f. \`stopwatch\` - Start a stopwatch  
g. \`calendar\` - Show calendar events  
h. \`goal\` - Set a goal  
i. \`habit\` - Track habits  
j. \`budget\` - Simple budget tracker  
k. \`poll\` - Create a poll  
l. \`meeting\` - Schedule meeting  
m. \`task-priority\` - Prioritize tasks  
n. \`word-count\` - Count words  
o. \`remind-me\` - Custom reminder
                `);
                break;

            case '3':
                await msg.reply(`
👨‍💻 *Developer Tools*  
a. \`format json\` - Auto-format JSON  
b. \`timestamp\` - Current UNIX time  
c. \`uuid\` - Generate UUID  
d. \`ip\` - Show local IP  
e. \`base64\` - Encode/decode Base64  
f. \`hash\` - Generate hash (MD5/SHA)  
g. \`url-encode\` - URL encode/decode  
h. \`regex-test\` - Test regex pattern  
i. \`http-status\` - HTTP status codes  
j. \`color-hex\` - Random color hex  
k. \`ascii\` - Text to ASCII art  
l. \`git-tip\` - Random Git tip  
m. \`npm-package\` - Search npm package  
n. \`jwt-decode\` - Decode JWT token  
o. \`lorem\` - Generate lorem ipsum
                `);
                break;

            case '4':
                await msg.reply(`
📜 *Quotes & Jokes*  
a. \`motivate\` - Motivational quote  
b. \`joke\` - Random joke  
c. \`proverb\` - Wise proverb  
d. \`roast me\` - Funny roast  
e. \`dad-joke\` - Classic dad joke  
f. \`inspire\` - Inspiring quote  
g. \`love-quote\` - Romantic quote  
h. \`funny-quote\` - Humorous quote  
i. \`life-advice\` - Life wisdom  
j. \`success-quote\` - Success quote  
k. \`pun\` - Wordplay pun  
l. \`yo-mama\` - Yo mama joke  
m. \`chuck-norris\` - Chuck Norris fact  
n. \`sarcasm\` - Sarcastic remark  
o. \`wisdom\` - Deep thought
                `);
                break;

            case '5':
                await msg.reply(`
🤖 *AI & Fun Stuff*  
a. \`8ball\` - Magic 8-ball  
b. \`fact\` - Fun fact  
c. \`emoji\` - Random emoji storm  
d. \`hack me\` - Simulated hack  
e. \`roll-dice\` - Roll a dice  
f. \`coin-flip\` - Flip a coin  
g. \`random-number\` - Random number  
h. \`password\` - Generate password  
i. \`pickup-line\` - Cheesy pickup line  
j. \`fortune\` - Fortune cookie  
k. \`animal-fact\` - Animal trivia  
l. \`space-fact\` - Space trivia  
m. \`meme-gen\` - Meme generator (text)  
n. \`dare\` - Fun dare  
o. \`truth\` - Truth question
                `);
                break;

            case '6':
                await msg.reply(`
⚙️ *Settings*  
a. \`language\` - Change language  
b. \`theme\` - Dark/Light mode (concept)  
c. \`reset\` - Reset preferences  
d. \`feedback\` - Share thoughts  
e. \`timezone\` - Set timezone  
f. \`nickname\` - Set bot nickname  
g. \`notifications\` - Toggle notifications  
h. \`privacy\` - Privacy settings  
i. \`status\` - Bot status  
j. \`backup\` - Backup data (concept)
                `);
                break;

                case '7':
                    try {
                        console.log('About command triggered for:', chatId);
                        const imagePath = './assets/public.jpg';
                
                        if (!fs.existsSync(imagePath)) {
                            console.error('Image file not found at:', imagePath);
                            await msg.reply('❌ Error: Image file not found. Contact the developer!');
                            return;
                        }
                
                        const media = MessageMedia.fromFilePath(imagePath);
                
                        await client.sendMessage(chatId, media, {
                            caption: `
                🤖 *vBot AI Deluxe*  
                Made with ❤️ by *Venom (Maseno Uni)* 🐍  
                Powered by *spacyfire* ⚙️  
                Uptime: 24/7 (real soon!)  
                💻 Contact for any tech service!
                
                🔗 *LinkedIn*: https://linkedin.com/in/owano-canol  
                👨‍💻 *GitHub*: https://github.com/Canol001  
                🌐 *Portfolio*: https://canol.rollbackbets.top/
                            `.trim()
                        });
                
                    } catch (error) {
                        console.error('Error in About command:', error.message);
                        await msg.reply('❌ Error sending About info. Try again later!');
                    }
                    break;
                

            case '8':
                await msg.reply(`
🆘 *Help Center*  
a. \`.menu\` - Main menu  
b. \`suggest\` - Suggest a feature  
c. \`bug\` - Report a bug  
d. \`tutorial\` - Bot tutorial  
e. \`faq\` - Frequently asked questions
                `);
                break;

            case '9':
                await msg.reply(`
🎲 *Games*  
a. \`rps\` - Rock, Paper, Scissors  
b. \`tic-tac-toe\` - Play Tic-Tac-Toe (concept)  
c. \`hangman\` - Hangman game  
d. \`number-guess\` - Guess the number  
e. \`word-scramble\` - Unscramble words  
f. \`math-quiz\` - Math challenge  
g. \`emoji-guess\` - Guess the emoji  
h. \`adventure\` - Text adventure  
i. \`puzzle\` - Simple puzzle  
j. \`battle\` - Fun text battle
                `);
                break;

            case '10':
                await msg.reply(`
🛠️ *Utilities*  
a. \`weather\` - Check weather (via API)  
b. \`translate\` - Translate text  
c. \`calc\` - Simple calculator  
d. \`unit-convert\` - Convert units  
e. \`currency\` - Currency converter  
f. \`qr-gen\` - Generate QR code (text)  
g. \`shorten-url\` - Shorten URL (API)  
h. \`define\` - Dictionary lookup  
i. \`news\` - Latest news (API)  
j. \`stock\` - Stock price (API)  
k. \`password-strength\` - Check password  
l. \`timezone-convert\` - Convert timezones  
m. \`file-info\` - Analyze file (concept)  
n. \`random-name\` - Random name generator  
o. \`poll-result\` - View poll results
                `);
                break;
        }

        // === FEATURE COMMANDS ===
        switch (message) {
            case 'joke':
                await msg.reply('😂 Why don’t scientists trust atoms? Because they make up everything!');
                break;

            case 'fact':
                await msg.reply('🧠 Did you know? Honey never spoils. Archeologists found 3000-year-old jars in Egyptian tombs still edible!');
                break;

            case '8ball':
                const responses = ['Yes.', 'No.', 'Maybe.', 'Absolutely!', 'Try again later.'];
                await msg.reply(`🎱 ${responses[Math.floor(Math.random() * responses.length)]}`);
                break;

            case 'clock':
                const now = new Date();
                await msg.reply(`🕒 Time: ${now.toLocaleTimeString()}\n📅 Date: ${now.toLocaleDateString()}`);
                break;

            case 'uuid':
                const { v4: uuidv4 } = require('uuid');
                await msg.reply(`🆔 UUID: ${uuidv4()}`);
                break;

            case 'roast me':
                await msg.reply('🔥 You have something on your chin... no, the third one down.');
                break;

            case 'riddle':
                await msg.reply('🧩 I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I? (Reply with answer!)');
                break;

            case 'trivia':
                await msg.reply('❓ Which planet is known as the Red Planet? (Reply: Mars)');
                break;

            case 'song':
                const songs = ['Bohemian Rhapsody', 'Shape of You', 'Blinding Lights'];
                await msg.reply(`🎵 Try this song: ${songs[Math.floor(Math.random() * songs.length)]}`);
                break;

            case 'movie':
                const movies = ['Inception', 'The Matrix', 'Parasite'];
                await msg.reply(`🎬 Watch this movie: ${movies[Math.floor(Math.random() * movies.length)]}`);
                break;

            case 'dance':
                const dances = ['Moonwalk', 'Floss', 'Salsa'];
                await msg.reply(`💃 Try this dance move: ${dances[Math.floor(Math.random() * dances.length)]}`);
                break;

            case 'story':
                await msg.reply('📖 Once upon a time, a curious coder discovered a hidden API... (Want more? Say "continue")');
                break;

            case 'emoji-story':
                await msg.reply('😺🌍🚀 A cat took over the world with a rocket! Add your emoji to continue!');
                break;

            case 'magic-trick':
                await msg.reply('🎩 Pick a number between 1-10, double it, subtract 2, and I’ll guess it! (Reply with final number)');
                break;

            case 'superhero':
                await msg.reply('🦸‍♂️ Your superhero name: CodeBlaster! Power: Bug-zapping lasers! Want another?');
                break;

            case 'cartoon':
                await msg.reply('📺 Are you more SpongeBob or Rick Sanchez? Take my quiz! (Say "quiz")');
                break;

            case 'prank':
                await msg.reply('😜 Text your friend: "Your phone is updating to Comic Sans mode!"');
                break;

            case 'meme':
                await msg.reply('😂 Meme loading... Try: "Distracted Boyfriend" meme!');
                break;

            case 'game':
                await msg.reply('🎮 Want a quick game? Try `rps` for Rock, Paper, Scissors!');
                break;

            case 'quiz':
                await msg.reply('❓ Quiz time! What’s 2+2? Reply: 4 (More? Say "next")');
                break;

            case 'timer':
                await msg.reply('⏲️ Timer started for 5 minutes! I’ll ping you when done. (Custom time? Say "timer 10m")');
                break;

            case 'stopwatch':
                await msg.reply('⏱️ Stopwatch started! Say "stop" to end.');
                break;

            case 'calendar':
                await msg.reply('📆 Today’s date: April 15, 2025. Want events? Say "add event"!');
                break;

            case 'goal':
                await msg.reply('🎯 Set a goal: "Finish project by Friday." Saved! Check? Say "list goals".');
                break;

            case 'habit':
                await msg.reply('✅ Track habit: "Drink water daily." Added! View? Say "list habits".');
                break;

            case 'budget':
                await msg.reply('💸 Budget tracker: Add expense with "add expense 10 coffee". Try it!');
                break;

            case 'poll':
                await msg.reply('📊 Create poll: "Pizza or Burger?" Reply with votes!');
                break;

            case 'meeting':
                await msg.reply('📅 Schedule meeting: Say "meet at 3pm tomorrow". Saved!');
                break;

            case 'task-priority':
                await msg.reply('📋 Prioritize: Send tasks like "1. Code, 2. Debug". I’ll sort!');
                break;

            case 'word-count':
                await msg.reply('📝 Send a sentence, I’ll count words! Try: "I love coding"');
                break;

            case 'remind-me':
                await msg.reply('⏰ Set reminder: Say "remind me call mom at 5pm". Got it!');
                break;

            case 'todo':
                await msg.reply('✅ Add task: Say "todo finish homework". List? Say "list todo".');
                break;

            case 'reminder':
                await msg.reply('🔔 Reminder set: Say "reminder meeting 10am". I’ll notify!');
                break;

            case 'note':
                await msg.reply('📝 Save note: Say "note buy milk". View? Say "list notes".');
                break;

            case 'base64':
                await msg.reply('🔢 Send text to encode/decode in Base64! Try: "base64 hello"');
                break;

            case 'hash':
                const crypto = require('crypto');
                await msg.reply(`🔒 MD5 hash of "test": ${crypto.createHash('md5').update('test').digest('hex')}`);
                break;

            case 'url-encode':
                await msg.reply('🌐 Send text to URL encode! Try: "url-encode hello world"');
                break;

            case 'regex-test':
                await msg.reply('🔍 Test regex: Send "regex /d+/ 123". I’ll check!');
                break;

            case 'http-status':
                await msg.reply('🌐 HTTP 200: OK. Want another? Say "http 404"');
                break;

            case 'color-hex':
                const hex = Math.floor(Math.random() * 16777215).toString(16);
                await msg.reply(`🎨 Random color: #${hex}`);
                break;

            case 'ascii':
                await msg.reply('🖼️ ASCII art: Send "ascii star" for a star!');
                break;

            case 'git-tip':
                await msg.reply('🔧 Git tip: Use `git stash` to save changes temporarily.');
                break;

            case 'npm-package':
                await msg.reply('📦 Search npm: Say "npm express" for package info.');
                break;

            case 'jwt-decode':
                await msg.reply('🔐 Send JWT token to decode! Try: "jwt <token>"');
                break;

            case 'lorem':
                await msg.reply('📜 Lorem ipsum: Lorem ipsum dolor sit amet... More? Say "lorem 10"');
                break;

            case 'format json':
                await msg.reply('🧹 Send JSON to format! Try: `{"name":"John"}`');
                break;

            case 'timestamp':
                await msg.reply(`⏰ UNIX timestamp: ${Math.floor(Date.now() / 1000)}`);
                break;

            case 'ip':
                await msg.reply('🌐 Local IP: 127.0.0.1 (Public IP? Use API!)');
                break;

            case 'dad-joke':
                await msg.reply('😆 Why can’t basketball players go on vacation? They’d get called for traveling!');
                break;

            case 'inspire':
                await msg.reply('🌟 "The only limit to our realization of tomorrow is our doubts of today." – FDR');
                break;

            case 'love-quote':
                await msg.reply('💖 "Love is not finding someone to live with; it’s finding someone you can’t live without."');
                break;

            case 'funny-quote':
                await msg.reply('😂 "I’m not lazy, I’m on energy-saving mode."');
                break;

            case 'life-advice':
                await msg.reply('🧘 "Take one step at a time; every step counts."');
                break;

            case 'success-quote':
                await msg.reply('🏆 "Success is not the absence of obstacles, but the courage to push through."');
                break;

            case 'pun':
                await msg.reply('😜 I’m reading a book on anti-gravity. It’s impossible to put down!');
                break;

            case 'yo-mama':
                await msg.reply('🤪 Yo mama so fat that she needs cheat codes for Wii Fit.');
                break;

            case 'chuck-norris':
                await msg.reply('💪 Chuck Norris can divide by zero.');
                break;

            case 'sarcasm':
                await msg.reply('🙄 Oh, brilliant idea! Why didn’t I think of that?');
                break;

            case 'wisdom':
                await msg.reply('🦉 "The only true wisdom is knowing you know nothing." – Socrates');
                break;

            case 'motivate':
                await msg.reply('🚀 "You’re one step away from greatness. Keep going!"');
                break;

            case 'proverb':
                await msg.reply('📜 "A journey of a thousand miles begins with a single step."');
                break;

            case 'roll-dice':
                await msg.reply(`🎲 You rolled: ${Math.floor(Math.random() * 6) + 1}`);
                break;

            case 'coin-flip':
                await msg.reply(`🪙 Result: ${Math.random() > 0.5 ? 'Heads' : 'Tails'}`);
                break;

            case 'random-number':
                await msg.reply(`🔢 Random number: ${Math.floor(Math.random() * 100)}`);
                break;

            case 'password':
                const pass = Math.random().toString(36).slice(-8);
                await msg.reply(`🔐 Password: ${pass}`);
                break;

            case 'pickup-line':
                await msg.reply('😘 Is your name Wi-Fi? Because I’m feeling a connection!');
                break;

            case 'fortune':
                await msg.reply('🍪 Fortune: "A great adventure awaits you."');
                break;

            case 'animal-fact':
                await msg.reply('🐘 Elephants never forget, and they can recognize themselves in mirrors!');
                break;

            case 'space-fact':
                await msg.reply('🌌 There are more stars in the universe than grains of sand on Earth.');
                break;

            case 'meme-gen':
                await msg.reply('🖼️ Meme text: Send "meme-gen Top text | Bottom text"');
                break;

            case 'dare':
                await msg.reply('😈 Dare: Text a friend "I know your secret!"');
                break;

            case 'truth':
                await msg.reply('🤫 Truth: What’s the weirdest food combo you’ve tried?');
                break;

            case 'emoji':
                const emojis = ['😺', '🚀', '🌮'];
                await msg.reply(`🎉 ${emojis[Math.floor(Math.random() * emojis.length)]} ${emojis[Math.floor(Math.random() * emojis.length)]}`);
                break;

            case 'hack me':
                await msg.reply('💾 *HACKING...* Just kidding! Your data’s safe. 😜 Want a real hack tip?');
                break;

            case 'timezone':
                await msg.reply('🌐 Set timezone: Say "timezone UTC+1". Default: UTC');
                break;

            case 'nickname':
                await msg.reply('😎 Set bot nickname: Say "nickname CoolBot". Done!');
                break;

            case 'notifications':
                await msg.reply('🔔 Toggle notifications: Say "notifications off". Current: On');
                break;

            case 'privacy':
                await msg.reply('🔒 Privacy: Your data stays with me. Want details? Say "privacy info"');
                break;

            case 'status':
                await msg.reply('📡 Bot status: Online, 100+ features, vibing! 🚀');
                break;

            case 'backup':
                await msg.reply('💾 Backup: Data saved (concept). Want to restore? Say "restore"');
                break;

            case 'language':
                await msg.reply('🌍 Set language: Say "language Spanish". Default: English');
                break;

            case 'theme':
                await msg.reply('🎨 Set theme: Say "theme dark". Current: Light');
                break;

            case 'reset':
                await msg.reply('🧹 Preferences reset! Start fresh with `.menu`');
                break;

            case 'feedback':
                await msg.reply('📬 Share feedback: Say "feedback Love the bot!" I’m listening!');
                break;

            case 'suggest':
                await msg.reply('💡 Suggest a feature: Say "suggest voice chat". Thanks!');
                break;

            case 'bug':
                await msg.reply('🐛 Report bug: Say "bug quiz crashes". I’ll check!');
                break;

            case 'tutorial':
                await msg.reply('📚 Tutorial: Start with `.menu`, try `joke`, or say `hi`! More?');
                break;

            case 'faq':
                await msg.reply('❓ FAQ: "How to use bot?" Just type `.menu`! Ask more!');
                break;

            case 'rps':
                const choices = ['rock', 'paper', 'scissors'];
                const botChoice = choices[Math.floor(Math.random() * 3)];
                await msg.reply(`✊ My choice: ${botChoice}. Send yours (rock/paper/scissors)!`);
                break;

            case 'tic-tac-toe':
                await msg.reply('⭕❌ Tic-Tac-Toe: Send "ttt start" to play (concept)!');
                break;

            case 'hangman':
                await msg.reply('🪢 Hangman: Guess the word: _ _ _ _. Send a letter!');
                break;

            case 'number-guess':
                await msg.reply('🔢 Guess my number (1-10)! Send your guess.');
                break;

            case 'word-scramble':
                await msg.reply('🔤 Unscramble: "olhel". Hint: Greeting. Reply with answer!');
                break;

            case 'math-quiz':
                await msg.reply('🧮 What’s 5 × 4? Reply with answer!');
                break;

            case 'emoji-guess':
                await msg.reply('😀 Guess the emoji: 😺 means? Reply: Cat');
                break;

            case 'adventure':
                await msg.reply('🗺️ You’re in a forest. Go "left" or "right"?');
                break;

            case 'puzzle':
                await msg.reply('🧩 Puzzle: Move 1 matchstick to fix 2+2=22. Reply with solution!');
                break;

            case 'battle':
                await msg.reply('⚔️ You vs. Dragon! Attack with "slash" or "run"!');
                break;

            case 'weather':
                await msg.reply('☀️ Weather: Say "weather Nairobi" for forecast!');
                break;

            case 'translate':
                await msg.reply('🌍 Translate: Say "translate hello to Spanish". Result: Hola');
                break;

            case 'calc':
                await msg.reply('🧮 Calculate: Say "calc 5 + 3". Result: 8');
                break;

            case 'unit-convert':
                await msg.reply('📏 Convert: Say "convert 10 km to miles". Result: 6.21 miles');
                break;

            case 'currency':
                await msg.reply('💵 Convert: Say "currency 10 USD to EUR". Try it!');
                break;

            case 'qr-gen':
                await msg.reply('📷 QR code: Say "qr-gen https://example.com" for QR text!');
                break;

            case 'shorten-url':
                await msg.reply('🔗 Shorten: Say "shorten https://example.com". Coming soon!');
                break;

            case 'define':
                await msg.reply('📖 Define: Say "define happy". Meaning: Feeling joy!');
                break;

            case 'news':
                await msg.reply('📰 News: Say "news tech" for headlines!');
                break;

            case 'stock':
                await msg.reply('📈 Stock: Say "stock AAPL" for price!');
                break;

            case 'password-strength':
                await msg.reply('🔒 Check password: Say "password-strength 123". Weak!');
                break;

            case 'timezone-convert':
                await msg.reply('⏰ Convert time: Say "timezone-convert 3pm UTC to EST". Result: 11am');
                break;

            case 'file-info':
                await msg.reply('📂 File info: Send file details (concept). Try: "file-info doc.pdf"');
                break;

            case 'random-name':
                const names = ['Alex', 'Sam', 'Taylor'];
                await msg.reply(`🧑 Random name: ${names[Math.floor(Math.random() * names.length)]}`);
                break;

            case 'poll-result':
                await msg.reply('📊 Poll results: No active polls. Start one with `poll`!');
                break;

            default:
                if (
                    ![
                        'hi', 'hello', '.menu', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                        'joke', 'fact', '8ball', 'clock', 'uuid', 'roast me', 'riddle', 'trivia', 'song', 'movie',
                        'dance', 'story', 'emoji-story', 'magic-trick', 'superhero', 'cartoon', 'prank', 'meme', 'game',
                        'quiz', 'timer', 'stopwatch', 'calendar', 'goal', 'habit', 'budget', 'poll', 'meeting',
                        'task-priority', 'word-count', 'remind-me', 'todo', 'reminder', 'note', 'base64', 'hash',
                        'url-encode', 'regex-test', 'http-status', 'color-hex', 'ascii', 'git-tip', 'npm-package',
                        'jwt-decode', 'lorem', 'format json', 'timestamp', 'ip', 'dad-joke', 'inspire', 'love-quote',
                        'funny-quote', 'life-advice', 'success-quote', 'pun', 'yo-mama', 'chuck-norris', 'sarcasm',
                        'wisdom', 'motivate', 'proverb', 'roll-dice', 'coin-flip', 'random-number', 'password',
                        'pickup-line', 'fortune', 'animal-fact', 'space-fact', 'meme-gen', 'dare', 'truth', 'emoji',
                        'hack me', 'timezone', 'nickname', 'notifications', 'privacy', 'status', 'backup', 'language',
                        'theme', 'reset', 'feedback', 'suggest', 'bug', 'tutorial', 'faq', 'rps', 'tic-tac-toe',
                        'hangman', 'number-guess', 'word-scramble', 'math-quiz', 'emoji-guess', 'adventure', 'puzzle',
                        'battle', 'weather', 'translate', 'calc', 'unit-convert', 'currency', 'qr-gen', 'shorten-url',
                        'define', 'news', 'stock', 'password-strength', 'timezone-convert', 'file-info', 'random-name',
                        'poll-result'
                    ].includes(message)
                ) {
                    try {
                        const imagePath = './assets/intro.jpg'; // Use a cool fallback image here
                        if (!fs.existsSync(imagePath)) {
                            await client.sendMessage(chatId, `
                    🤔 *I didn't catch that!*  
                    Type \`.menu\` to explore
                    Here are some commands you can try:
                    
                    📜 \`.about\` - Bot info & credits  
                    🛠️ \`.menu\` - List of all features  
                    🎮 \`.fun\` - Jokes, games & more  
                    📚 \`.ai\` - Chat with AI (OpenAI)  
                    💰 \`.mpesa\` - M-PESA integration  
                    🎨 \`.style\` - Name styling & fonts  
                    🌍 \`.web\` - Browse links, news, etc.  
                    📅 \`.time\` - Date/time utilities  
                    📊 \`.stats\` - Bot stats & usage
                    
                    Still lost? Try typing \`hi\` or \`.help\` 🙌
                            `, { quotedMessageId: null });
                        } else {
                            const media = MessageMedia.fromFilePath(imagePath);
                            await client.sendMessage(chatId, media, {
                                caption: `🤖 *VenomV_19*  
                    🤔 *I didn't catch that!*  
                    Type \`.menu\` to explore 
                    
                    🔧 *Popular Commands*:
                    📜 \`.about\` - Bot info  
                    🛠️ \`.menu\` - All features  
                    💡 \`.ai\` - Ask AI anything  
                    📚 \`.help\` - Help guide  
                    💵 \`.mpesa\` - Payment features  
                    🎉 \`.fun\` - Mini games  
                    🧪 \`.labs\` - Experimental stuff  
                    
                    📍 Try something cool!
                                `,
                                quotedMessageId: null
                            });
                        }
                    
                        console.log(`Sent default response to ${chatId} for message: ${message}`);
                    } catch (replyError) {
                        console.error('Error sending default response:', replyError.message);
                    }
                }
                break;
        }
    } catch (error) {
        console.error('Error processing message:', error.message);
        try {
            await client.sendMessage(chatId, '❌ Something went wrong! Try again or contact the developer.', { quotedMessageId: null });
        } catch (replyError) {
            console.error('Failed to send error reply:', replyError.message);
        }
    }
});

client.initialize();