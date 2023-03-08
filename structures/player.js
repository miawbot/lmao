const { CommandInteraction } = require('discord.js')
const { DisTube, Queue, Song } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require("@distube/yt-dlp")

class Player extends DisTube {
    /**
     * 
     * @param {Bibimbap} client 
     */
    constructor(client) {
        super(client, {
            nsfw: false,
            searchSongs: 0,
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 60,
            leaveOnFinish: false,
            leaveOnStop: true,
            plugins: [
                new YtDlpPlugin({ update: false }),
                new SpotifyPlugin({
                    parallel: true,
                    emitEventsAfterFetching: true,
                    api: { clientId: process.env.SPOTIFY_ID, clientSecret: process.env.SPOTIFY_SECRET },
                })
            ]
        });
    }

    /**
     * 
     * @param {Queue} queue 
     * @returns {Queue}
     */
    async randomizeQueue(queue) {
        return await queue.shuffle();
    }

    /**
     * 
     * @param {Queue} queue 
     * @returns {Promise<Song>|null}
     */
    skipSong(queue) {
        return queue.songs.length <= 1 ? queue.stop() : queue.skip();
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {string} query 
     */
    async playSong(interaction, query) {
        const voiceChannel = interaction.member.voice.channel;
        await this.play(voiceChannel, query, { textChannel: interaction.channel, member: interaction.member, });
    }
}

module.exports = { Player };
