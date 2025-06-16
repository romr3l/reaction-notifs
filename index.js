const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User]
});

const TOKEN = process.env.BOT_TOKEN;
const MESSAGE_ID = process.env.WATCHED_MESSAGE_ID;
const CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID;

const emojiToOption = {
    'one': 'Staffing Department',
    'two': 'Relations Department',
    'three': 'Recruitment Department'
};

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

async function handleReaction(reaction, user, type) {
    try {
        if (user.bot) return;

        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();

        console.log(`[${type.toUpperCase()}] emoji.name =`, reaction.emoji.name);
        console.log(`[${type.toUpperCase()}] message.id =`, reaction.message.id);

        if (reaction.message.id !== MESSAGE_ID) return;

        const option = emojiToOption[reaction.emoji.name];
        if (!option) return;

        const notifyChannel = await client.channels.fetch(CHANNEL_ID);
        if (!notifyChannel?.isTextBased()) return;

        const action = type === 'add' ? 'selected' : 'unselected';
        notifyChannel.send(`<@${user.id}> has ${action} **${option}**`);
    } catch (err) {
        console.error(`❌ Error handling ${type} reaction:`, err);
    }
}

client.on('messageReactionAdd', (reaction, user) => {
    handleReaction(reaction, user, 'add');
});

client.on('messageReactionRemove', (reaction, user) => {
    handleReaction(reaction, user, 'remove');
});

client.login(TOKEN);

