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
        if (queue.songs.length <= 1) {
            queue.stop();
        } else {
            queue.skip();
        }
    }

    playSong(interaction, search) {
        const channel = interaction.member.voice.channel;

        this.play(channel, search, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
    }
}

class DistubeEventType {
    constructor() {
        return this;
    }
}

class DistubeType {
    /**
     *
     * @param options {{require_shared_voice_channel, require_in_voice_channel} | null}
     * @returns {DistubeType}
     */
    constructor(options = null) {
        if (options) {
            this.require_shared_voice_channel = options.require_shared_voice_channel || false;
            this.require_in_voice_channel = options.require_in_voice_channel || true;
        }

        return this;
    }
}

module.exports = { Distube, DistubeType, DistubeEventType };
