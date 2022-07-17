module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
        const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs resethook`)){
            const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("ADMINISTRATOR")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `ADMINISTRATOR`"})
            const channels = JSON.parse(LoadResourceFile(GetCurrentResourceName(), '/config/channels.json'));
            const args = content.split(" ")
            if(!channels['imageStore']){
                return channel.send(`Please use \`!jdlogs setup\` first.`)
            }

            const c = await guild.channels.cache.get(channels['imageStore'].channelId)
            
            const hooks = await guild.fetchWebhooks();
            await hooks.forEach(async webhook => {
                if(webhook.channelId === c.id){
                    webhook.delete(`Requested per ${author.tag}`);
                }
            });

            await c.createWebhook('Image Store Webhook', {}).then(async hook => {
                channels['imageStore'].webhookID = hook.id;
                channels['imageStore'].webhookToken = hook.token;
            })

            const newChannels = JSON.stringify(channels, null, 2)
            SaveResourceFile(GetCurrentResourceName(), '/config/channels.json', newChannels);
            channel.send(`Webhook for Image store has been reset!\n**If you set a webhook then the bot will delete the old one.**`)           
		}
	},
};