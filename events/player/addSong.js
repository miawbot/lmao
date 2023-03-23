const { Event } = require('../../helpers/event');
const { EmbedBuilder } = require('discord.js');
const { Topokki } = require('../../structures/topokki');
const { Queue, Song } = require('distube');

module.exports = new Event({
    name: 'addSong',
    isPlayer: true,

    /**
     * 
     * @param {Topokki} client 
     * @param {Queue} queue 
     * @param {Song} song 
     */
    callback(client, queue, song) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'added to queue' })
            .setTitle(song.name)
            .setTimestamp()
            .addFields(
                {
                    name: 'channel',
                    value: song.uploader.name,
                    inline: true,
                },
                {
                    name: 'song duration',
                    value: song.formattedDuration,
                    inline: true,
                },
                {
                    name: 'estimate time of playing',
                    value: queue.formattedCurrentTime,
                    inline: true,
                },
                {
                    name: 'position in queue',
                    value: (queue.songs.length - 1 || 'none').toString(),
                    inline: true,
                },
            );

        queue.textChannel.send({ embeds: [embed] });
    },
});
