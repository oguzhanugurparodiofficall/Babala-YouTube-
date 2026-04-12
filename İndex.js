const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const YOUTUBE_CHANNEL_ID = 'UCsT8cMFwAK3cqSUFbSv9OxA';
const DISCORD_CHANNEL_ID = '1216975782514135211';
let lastVideoId = null;

async function checkYoutube() {
  try {
    const res = await axios.get('https://www.youtube.com/feeds/videos.xml?channel_id=' + YOUTUBE_CHANNEL_ID);
    const match = res.data.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    if (match) {
      const videoId = match[1];
      if (lastVideoId && lastVideoId !== videoId) {
        const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
        if (channel) channel.send('Babala TV yeni video yukledi https://youtube.com/watch?v=' + videoId);
      }
      lastVideoId = videoId;
      console.log('Kontrol edildi:', videoId);
    }
  } catch (e) {
    console.log('Hata:', e.message);
  }
}

client.once('ready', () => {
  console.log('Bot aktif: ' + client.user.tag);
  checkYoutube();
  setInterval(checkYoutube, 5 * 60 * 1000);
});

client.login(process.env.f93686b3e1b54b214faa53c75a5163bf4c856d149c0acba90cc03e560db57d2a
            );
