const { getVoiceConnection } = require("@discordjs/voice");
const { ApplicationCommandOptionType } = require("discord.js")
module.exports = {
    name: "rewind",
    description: "Rewinds for X (secs)",
    options: [
        {
            name: "time",
            description: "For how many seconds do you want to rewind?",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    run: async (client, interaction, args, prefix) => {
        try {
            if(!interaction.member.voice.channelId) return interaction.reply(({ ephemeral: true, content: "👎 **Please join a Voice-Channel first!**"})).catch(() => null);
            
            const oldConnection = getVoiceConnection(interaction.guild.id);
            if(!oldConnection) return interaction.reply({ ephemeral: true, content:"👎 **I'm not connected somewhere!**"}).catch(() => null);
            if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content:"👎 **We are not in the same Voice-Channel**!"}).catch(() => null);
            
            const queue = client.queues.get(interaction.guild.id); // get the queue
            if(!queue || !queue.tracks || !queue.tracks[0]) { 
                return interaction.reply({ ephemeral: true, content: `👎 **Nothing playing right now**`}).catch(() => null);
            }
            const curPos = oldConnection.state.subscription.player.state.resource.playbackDuration;
        
            if(!args[0] || isNaN(args[0])) return interaction.reply({ ephemeral: true, content:`👎 **You forgot to add the rewinding-time!** Usage: \`${prefix}rewind <Time-In-S>\``}).catch(() => null);
            if(Math.floor(curPos / 1000 - 1) <= 0) return interaction.reply({ ephemeral: true, content:`👎 **There is nothing to rewind, play a song long enough!**`}).catch(() => null);
            if(Number(args[0]) < 0 || Number(args[0]) > Math.floor((curPos) / 1000 - 1))
            return interaction.reply({ ephemeral: true, content:`👎 **The Rewind-Number-Pos must be between \`0\` and \`${Math.floor((curPos) / 1000 - 1)}\`!**`}).catch(() => null);
            
            const newPos = curPos - Number(args[0]) * 1000;
            // set Filterschanged to true
            queue.filtersChanged = true;
            // seek
            oldConnection.state.subscription.player.stop();
            oldConnection.state.subscription.player.play(client.getResource(queue, queue.tracks[0].id, newPos));
                        
            interaction.reply({ ephemeral: true, content:`⏪ **Rewinded for \`${args[0]}s\` to \`${client.formatDuration(newPos)}\`**!`}).catch(() => null);
        } catch(e) { 
            console.error(e);
            interaction.reply({ ephemeral: false, content:`❌ Could not join your VC because: \`\`\`${e.interaction || e}`.substring(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
};