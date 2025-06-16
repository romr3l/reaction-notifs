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
    'one': 'Staffing Department',
    'two': 'Relations Department',
    'three': 'Recruitment Department'
};

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

async function handleReaction(reaction, user, type) {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.message.id !== MESSAGE_ID) return;

    const option = emojiToOption[reaction.emoji.name];
    if (!option) return;

    const notifyChannel = await client.channels.fetch(CHANNEL_ID);
    if (!notifyChannel?.isTextBased()) return;

    const action = type === 'add' ? 'selected' : 'unselected';
    notifyChannel.send(`<@${user.id}> has ${action} **${option}**`);
}

client.on('messageReactionAdd', (reaction, user) => {
    handleReaction(reaction, user, 'add');
});

client.on('messageReactionRemove', (reaction, user) => {
    handleReaction(reaction, user, 'remove');
});

client.login(TOKEN);
