const { Console } = require('console');
const { Client, Collection, MessageEmbed } = require('discord.js');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

const config = require("./config/config.json");
const client = [];
const permissionCheck = ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_WEBHOOKS"]

for (const x in config.tokens) {
    client[x] = new Client({
        intents: 32767,
        partials: ["CHANNEL"],
    });
    if(config.tokens[x].token !== ''){
        client[x].login(config.tokens[x].token).catch(async err => {
            if (err.code === 'DISALLOWED_INTENTS'){
                await console.log(`^1JD_logsV3 Error:^0 Bot ^4${client[x].user.tag}^0 Does not have the required Intents.`)
                await console.log(`^1JD_logsV3 Error:^0 Please make sure to add the following Intents to the bot:`)
                await console.log(`^1JD_logsV3 Error:^0 • PRESENCE INTENT`)
                await console.log(`^1JD_logsV3 Error:^0 • SERVER MEMBERS INTENT`)
                await console.log(`^1JD_logsV3 Error:^0 • MESSAGE CONTENT INTENT`)
            } else if(err.code === 'TOKEN_INVALID') {
                await console.log(`^1JD_logsV3 Error:^0 Bot Token for bot ^4${x}^0 is invalid.`)
            }
        })
        client[x].on("ready", async () => {
            let dest = false
            if(x == '1'){
                const checkGuild = client[x].guilds.cache.get(config.tokens[x].guildID)
                for (const i in permissionCheck) {
                    if(!checkGuild.me.permissions.has(permissionCheck[i])){
                        await console.log(`^1JD_logsV3 Error:^0 Bot ^4${client[x].user.tag}^0 is missing the ^4${permissionCheck[i]}^0 permission.`)
                        dest = true
                    }
                };
            }
            if(dest){
                console.log(`^1JD_logsV3 Error:^0 Fix the permissions for ^4${client[x].user.tag}^0 and restart JD_logsV3!`)
            } else {
                console.log(`Client ${client[x].user.tag} ready!`)
            }
        })
    }
}

client[1].config = config

const eventFiles = fs.readdirSync(`${GetResourcePath(GetCurrentResourceName())}/events/`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client[1].once(event.name, (...args) => event.execute(...args));
	} else {
		client[1].on(event.name, (...args) => event.execute(...args));
	}
}

async function sendEmbed(args){
    if(GetCurrentResourceName() === GetInvokingResource()){
        const channels = JSON.parse(LoadResourceFile(GetCurrentResourceName(), '/config/channels.json'));
        if(!channels[args.channel]){ return console.log(`^1Error: Channel ${args.channel} not found.^0`)}
        if(!args.client){ args.client = 1 }
        if(!channels[args.channel].icon){ channels[args.channel].icon = "📌" }
        if(client[args.client].user === null){ return }
        const guild = await client[args.client].guilds.cache.get(config.tokens[args.client].guildID);
        const channel = await guild.channels.cache.get(channels[args.channel].channelId);
        const embed = new MessageEmbed()
            .setTitle(`${channels[args.channel].icon} ${args.channel.charAt(0).toUpperCase() + args.channel.slice(1)}`)
            .setDescription(args.msg)
            .setColor(channels[args.channel].color)
            .setTimestamp()
            .setFooter({text: `JD_logs Version: ${GetResourceMetadata(GetCurrentResourceName(), 'version')}`})
        
            if(args.player_1){
                disp = ``
                if(args.player_1['info'].id){
                    disp = `:1234: **Player ID:** \`${args.player_1['info'].id}\``
                }
                if(args.player_1['info'].postal){
                    disp = `${disp}\n:map: **Nearest Postal:** \`${args.player_1['info'].postal}\``
                }
                if(args.player_1['info'].hp){
                    disp = `${disp}\n:heart: **Health:** \`${args.player_1['info']['hp'].hp}\`**/**\`${args.player_1['info']['hp'].max_hp}\``
                }
                if(args.player_1['info']['hp'].armour !== null && args.player_1['info']['hp'].armour !== undefined){
                    disp = `${disp} :shield: **Armor:** \`${args.player_1['info']['hp'].armour}\`**/**\`${args.player_1['info']['hp'].max_armour}\``
                }
                if(args.player_1['info'].discord){
                    disp = `${disp}\n:speech_balloon: **Discord:** <@${args.player_1['info']['discord']}> (${args.player_1['info']['discord']})`
                }
                if(args.player_1['info'].steam){
                    disp = `${disp}\n:video_game: **Steam Hex:** ${args.player_1['info']['steam']['id']}`
                }
                if(args.player_1['info']['steam'].url){
                    disp = `${disp} **[Steam Profile](${args.player_1['info']['steam']['url']} "Open Steam Profile")**`
                }
                if(args.player_1['info'].license){
                    disp = `${disp}\n:cd: **License:** ${args.player_1['info']['license'][0]}\n:dvd: **License 2:** ${args.player_1['info']['license'][1]}`
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
                if(args.player_2['info'].steam){
                    disp = `${disp}\n:video_game: **Steam Hex:** ${args.player_2['info']['steam']['id']}`
                }
                if(args.player_2['info']['steam'].url){
                    disp = `${disp} **[Steam Profile](${args.player_2['info']['steam']['url']} "Open Steam Profile")**`
                }
                if(args.player_2['info'].license){
                    disp = `${disp}\n:cd: **License:** ${args.player_2['info']['license'][0]}\n:dvd: **License2:** ${args.player_2['info']['license'][1]}`
                }
                embed.addField(args.player_2.title, `${disp}`, true)
            }
            
            if(args.imageUrl){
                embed.setImage(args.imageUrl)
            }

        if(args.channel === 'system'){
            await channel.send({content: "||Tags: @here||", embeds: [embed]})
            return 200
        } else {
            await channel.send({embeds: [embed]})
            const all = guild.channels.cache.get(channels['all'].channelId);
            all.send({embeds: [embed]})
            return 200
        }
    } else {        
        return 505
    }
}

exports('sendEmbed', async (args) => {
    return sendEmbed(args)
});