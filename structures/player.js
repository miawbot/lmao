const { CommandInteraction } = require('discord.js')
const { DisTube, Queue, Song, PlayOptions } = require('distube');
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

        this.client = client;
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
     * @param {PlayOptions} options
     */
    async playSong(interaction, query, options = {}) {
        return this.play(interaction.member.voice.channel, query, {
            textChannel: interaction.channel,
            member: interaction.member,
            ...options
        })
    }
}

module.exports = { Player };
