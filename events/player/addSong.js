const { Event } = require('../../helpers/event');
const { EmbedBuilder } = require('discord.js');
const { Topokki } = require('../../structures/topokki');
const { Queue, Song } = require('distube');

module.exports = new Event({
    'name': 'addSong',
    'isPlayer': true,

    /**
     * 
     * @param {Topokki} client 
     * @param {Queue} queue 
     * @param {Song} song 
     */
    callback(client, queue, song) {
        const embed = new EmbedBuilder()
            .setAuthor({ 'name': 'Added to Queue' })
            .setTitle(song.name)
            .setTimestamp()
            .setColor('#1E1F22')
            .addFields(
                {
                    'name': 'By',
                    'value': song.uploader.name,
                    'inline': true,
                },
                {
                    'name': 'Song duration',
                    'value': song.formattedDuration,
                    'inline': true,
                },
                {
                    'name': 'Estimate time of playing',
                    'value': queue.formattedCurrentTime,
                    'inline': true,
                },
                {
                    'name': 'Position',
                    'value': (queue.songs.length - 1 || 'None').toString(),
                    'inline': true,
                },
            );

        queue.textChannel.send({ 'embeds': [embed] });
    },
});
