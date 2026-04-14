const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DISCORD_CHANNEL_ID = '1216975782514135211';

const channels = [
    { id: 'UCsT8cMFwAK3cqSUFbSv9OxA', name: 'Babala TV', lastVideoId: null },
    { id: 'UCCsdGCxobBuWh1dUYCeRBoQ', name: 'Babalayka', lastVideoId: null }
];

async function checkYoutube() {
    for (const ch of channels) {
        try {
            const res = await axios.get('https://www.youtube.com/feeds/videos.xml?channel_id=' + ch.id);
            const match = res.data.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            if (match) {
                const videoId = match[1];
                if (ch.lastVideoId && ch.lastVideoId !== videoId) {
                    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
                    if (channel) channel.send(ch.name + ' yeni video yukledi! https://youtube.com/watch?v=' + videoId);
                }
                ch.lastVideoId = videoId;
                console.log(ch.name + ' kontrol edildi:', videoId);
            }
        } catch (e) {
            console.log(ch.name + ' hata:', e.message);
        }
    }
}

client.once('ready', () => {
    console.log('Bot aktif: ' + client.user.tag);
    checkYoutube();
    setInterval(checkYoutube, 5 * 60 * 1000);
});

client.login(process.env.TOKEN);
