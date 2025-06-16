const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// 🔐 ENV VARIABLES (Set in Railway)
const TOKEN = process.env.BOT_TOKEN;
const MESSAGE_ID = process.env.WATCHED_MESSAGE_ID;
const CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID;

// ✅ Reaction to Department Mapping
const emojiToOption = {
    '1️⃣': 'Staffing Department',
    '2️⃣': 'Relations Department',
    '3️⃣': 'Recruitment Department'
};

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    // Fetch partials if needed
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    // Only care about the specific tracked message
    if (reaction.message.id !== MESSAGE_ID) return;

    const option = emojiToOption[reaction.emoji.name];
    if (!option) return;

    const notifyChannel = await client.channels.fetch(CHANNEL_ID);
    if (notifyChannel?.isTextBased()) {
        notifyChannel.send(`<@${user.id}> has selected **${option}**`);
    }
});

client.login(TOKEN);
