const { Console } = require('console');
const { Client, Collection, MessageEmbed } = require('discord.js');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

try {
    config = require("./config/config.json");
    channels = require("./config/channels.json");
} catch {}

const client = [];
const permissionCheck = ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_WEBHOOKS"]

for (const x in config.tokens) {
    client[x] = new Client({
        intents: 32767,
        partials: ["CHANNEL"],
    });
    if(config.tokens[x].guildID == ''){
        console.log(`^1JD_logsV3 Error:^0 Bot ^4${x}^0 is missing a GuildID in de config.`)
        console.log(`^1JD_logsV3 Error:^0 Make sure to add this to your config or the bot won't send any messages.`) 
    }
    if(config.tokens[x].token !== ''){
        try{
            client[x].login(config.tokens[x].token).catch(async err => {
                if (err.code === 'DISALLOWED_INTENTS'){
                    await console.log(`^1JD_logsV3 Error:^0 Bot ^4${x}^0 Does not have the required Intents.`)
                    await console.log(`^1JD_logsV3 Error:^0 Please make sure to add the following Intents to the bot:`)
                    await console.log(`^1JD_logsV3 Error:^0 • PRESENCE INTENT`)
                    await console.log(`^1JD_logsV3 Error:^0 • SERVER MEMBERS INTENT`)
                    await console.log(`^1JD_logsV3 Error:^0 • MESSAGE CONTENT INTENT`)
                } else if(err.code === 'TOKEN_INVALID') {
                    await console.log(`^1JD_logsV3 Error:^0 Bot Token for bot ^4${x}^0 is invalid.`)
                }
            })
        } catch {
            console.log(`^1JD_logsV3 Error:^0 Could not login with bot token ${x}`)
        }
        client[x].on("ready", async () => {
            let dest = false
            client[x].user.setPresence({ activities: [{ name: `JD_logsV3 • Bot Client: ${x}/${Object.keys(config.tokens).length}`, type: "PLAYING" }], afk: true, status: 'dnd' });
            if(x == '1'){
                try{
                    const checkGuild = client[x].guilds.cache.get(config.tokens[x].guildID)
                    for (const i in permissionCheck) {
                        if(!checkGuild.me.permissions.has(permissionCheck[i])){
                            await console.log(`^1JD_logsV3 Error:^0 Bot ^4${client[x].user.tag}^0 is missing the ^4${permissionCheck[i]}^0 permission.`)
                            dest = true
                        }
                    };
                } catch {
                    console.log(`^1JD_logsV3 Error:^0 Could not verify permissions for ^4${client[x].user.tag}^0. Make sure you added a guild id.`)
                }
            }
            if(dest){
                console.log(`^1JD_logsV3 Error:^0 Fix the permissions for ^4${client[x].user.tag}^0 and restart JD_logsV3!`)
            } else {
                console.log(`Client ${client[x].user.tag} ready!`)
            }
        })
        client[x].on("rateLimit", async (data) => {
            if(Math.floor(data.timeout/1000) < 10 ) return
            await console.log(`^1JD_logsV3 Error:^0Rate limit hit on client: ^4${x}^0`)
            await console.log(`^1JD_logsV3 Error:^0Consider adding another bot token to spread load more.`)
            await console.log(`^1JD_logsV3 Error:^0Messages will be in a queue until the rate limit ends: ^4${data.timeout/1000}^0 Seconds.`)
        })
    }
}

client[1].config = config;

const eventFiles = fs.readdirSync(`${GetResourcePath(GetCurrentResourceName())}/events/`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client[1].once(event.name, (...args) => event.execute(...args));
	} else {
		client[1].on(event.name, (...args) => event.execute(...args));
	}
}

const commandFiles = fs.readdirSync(`${GetResourcePath(GetCurrentResourceName())}/commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const event = require(`./commands/${file}`);
	if (event.once) {
		client[1].once(event.name, (...args) => event.execute(...args));
	} else {
		client[1].on(event.name, (...args) => event.execute(...args));
	}
}

async function sendEmbed(args){
if(GetCurrentResourceName() !== GetInvokingResource()) return 505
    if(!channels[args.channel]){ return console.log(`^1Error: Channel ${args.channel} not found.^0`)}
    if(!args.client){ args.client = 1 }
    if(!channels[args.channel].icon){ channels[args.channel].icon = "📌" }
    if(client[args.client].user === null){ return }        
    const guild = await client[args.client].guilds.cache.get(config.tokens[args.client].guildID);
    const channel = await guild.channels.cache.get(channels[args.channel].channelId);
    const embed = new MessageEmbed()
        .setTitle(`${channels[args.channel].icon} ${args.channel.charAt(0).toUpperCase() + args.channel.slice(1)}`)
        .setColor(channels[args.channel].color)
        .setTimestamp()
        .setFooter({text: `JD_logs Version: ${GetResourceMetadata(GetCurrentResourceName(), 'version')}`})
    
        if(args.msg){
            embed.setDescription(args.msg)
        }

        if(args.player_1){
            disp = ``
            if(args.player_1['info'].id && config.playerId){
                disp = `:1234: **Player ID:** \`${args.player_1['info'].id}\``
            }
            if(args.player_1['info'].postal && config.postals){
                disp = `${disp}\n:map: **Nearest Postal:** \`${args.player_1['info'].postal}\``
            }
            if(args.player_1['info'].hp && config.playerHealth){
                disp = `${disp}\n:heart: **Health:** \`${args.player_1['info']['hp'].hp}\`**/**\`${args.player_1['info']['hp'].max_hp}\``
            }
            if(args.player_1['info']['hp'].armour && config.playerArmor){
                disp = `${disp} :shield: **Armor:** \`${args.player_1['info']['hp'].armour}\`**/**\`${args.player_1['info']['hp'].max_armour}\``
            }
            if(args.player_1['info'].discord && config.discordId){
                disp = `${disp}\n:speech_balloon: **Discord:** <@${args.player_1['info']['discord']}> (${args.player_1['info']['discord']})`
            }
            if(args.player_1['info'].ip && config.ip){
                disp = `${disp}\n:link: **IP:** ||${args.player_1['info']['ip']}||`
            }
            if(args.player_1['info'].ping && config.playerPing){
                disp = `${disp}\n:bar_chart: **Ping:** \`${args.player_1['info']['ping']}ms\``
            }
            if(args.player_1['info'].steam && config.steamId){
                disp = `${disp}\n:video_game: **Steam Hex:** ${args.player_1['info']['steam']['id']}`
            }
            if(args.player_1['info']['steam'].url && config.steamURL){
                disp = `${disp} **[Steam Profile](${args.player_1['info']['steam']['url']} "Open Steam Profile")**`
            }
            if(args.player_1['info'].license[0] && config.license){
                disp = `${disp}\n:cd: **License:** ${args.player_1['info']['license'][0] ?? 'N/A'}\n:dvd: **License 2:** ${args.player_1['info']['license'][1] ?? 'N/A'}`
            }
            embed.addField(args.player_1.title, `${disp}`, true)
        }

        if(args.player_2){
            disp = ``
            if(args.player_2['info'].id){
                disp = `:1234: **Player ID:** \`${args.player_2['info'].id}\``
            }
            if(args.player_2['info'].postal){
                disp = `${disp}\n:map: **Nearest Postal:** \`${args.player_2['info'].postal}\``
            }
            if(args.player_2['info'].hp){
                disp = `${disp}\n:heart: **Health:** \`${args.player_2['info']['hp'].hp}\`**/**\`${args.player_2['info']['hp'].max_hp}\``
            }
            if(args.player_2['info']['hp'].armour !== null && args.player_2['info']['hp'].armour !== undefined){
                disp = `${disp} :shield: **Armor:** \`${args.player_2['info']['hp'].armour}\`**/**\`${args.player_2['info']['hp'].max_armour}\``
            }
            if(args.player_2['info'].discord){
                disp = `${disp}\n:speech_balloon: **Discord:** <@${args.player_2['info']['discord']}> (${args.player_2['info']['discord']})`
            }
            if(args.player_2['info'].ip){
                disp = `${disp}\n:link: **IP:** ${args.player_2['info']['ip']}`
            }
            if(args.player_2['info'].ping){
                disp = `${disp}\n:bar_chart: **Ping:** \`${args.player_2['info']['ping']}ms\``
            }
            if(args.player_2['info'].steam){
                disp = `${disp}\n:video_game: **Steam Hex:** ${args.player_2['info']['steam']['id']}`
            }
            if(args.player_2['info']['steam'].url){
                disp = `${disp} **[Steam Profile](${args.player_2['info']['steam']['url']} "Open Steam Profile")**`
            }
            if(args.player_2['info'].license[0]){
                disp = `${disp}\n:cd: **License:** ${args.player_2['info']['license'][0]}\n:dvd: **License2:** ${args.player_2['info']['license'][1]}`
            }
            embed.addField(args.player_2.title, `${disp}`, true)
        }
        
        if(args.imageUrl){
            embed.setImage(args.imageUrl)
        }

        if(args.fields){
            embed.addFields(args.fields)
        }

    if(args.channel === 'system'){
        try {
            await channel.send({embeds: [embed]})
        } catch {
            console.log(`^1JD_logs Error: ^2${client[args.client].user.tag}^0 Could not send message to ^2system^0 channel`)
        }
        return 200
    } else {
        if(channels[args.channel].embed){
            try {
                await channel.send({embeds: [embed]})    
            } catch {
                console.log(`^1JD_logs Error: ^2${client[args.client].user.tag}^0 Could not send message to ^2${args.channel}^0 channel`)
            }            
        } else {
            try {
                await channel.send({content: args.msg})    
            } catch {
                console.log(`^1JD_logs Error: ^2${client[args.client].user.tag}^0 could not send message to ^2${args.channel}^0 channel`)
            }            
        }
        const guildAll = await client[channels['all'].client].guilds.cache.get(config.tokens[channels['all'].client].guildID);
        const all = guildAll.channels.cache.get(channels['all'].channelId);
        if(channels['all'].embed){
            try {
                await all.send({embeds: [embed]})   
            } catch {
                console.log(`^1JD_logs Error: ^2${client[args.client].user.tag}^0 Could not send message to ^2all^0 channel`)
            }
        } else {
            try {
                await all.send({content: args.msg})
            } catch {
                console.log(`^1JD_logs Error: ^2${client[args.client].user.tag}^0 Could not send message to ^2all^0 channel`)
            }
        }
        return 200
    }
}

exports('sendEmbed', async (args) => {
    return sendEmbed(args)
});

client[1].on('messageCreate', async (message) => {
    const {channel, content, guild, author} = message;
    if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs players`)){
        const tUser = await message.guild.members.cache.get(author.id);
        if(!tUser.permissions.has("MANAGE_MESSAGES")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `MANAGE_MESSAGES`"})
        const players = await exports[GetCurrentResourceName()].GetPlayers()
        let playerlist = 'No Players Online.'
        for (const [k, v] of Object.entries(players)) {
            console.log(k,v)
            if(playerlist === 'No Players Online.'){ 
                playerlist = `**${Number(k) + 1}.** ${GetPlayerName(v)} - Server ID: \`${v}\``
            } else {
                playerlist = `\n${playerlist} **${k + 1}.** ${GetPlayerName(v)} - Server ID: \`${v}\``
            };
        };
        message.reply({embeds: [new MessageEmbed().setColor("RANDOM").setDescription(playerlist)]})
    }
})