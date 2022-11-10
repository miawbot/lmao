const distube = require('distube');
const spotify = require('@distube/spotify');

class SpotifyPlugin extends spotify.SpotifyPlugin {
    constructor() {
        super({
            parallel: true,
            emitEventsAfterFetching: true,
            api: {
                clientId: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET,
            },
        });
    }
}

class Distube extends distube.DisTube {
    constructor(client) {
        super(client, {
            nsfw: false,
            searchSongs: 0,
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 60,
            leaveOnFinish: false,
            leaveOnStop: true,
            youtubeCookie: process.env.YOUTUBE_COOKIE,
            plugins: [new SpotifyPlugin()],
        });
    }

    async shuffleQueue(queue) {
        return await queue.shuffle();
    }

    skipSong(queue) {
        return queue.songs.length <= 1 ? queue.stop() : queue.skip();
    }

    playSong(interaction, search) {
        this.play(interaction.member.voice.channel, search, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
    }
}

module.exports = { Distube };
