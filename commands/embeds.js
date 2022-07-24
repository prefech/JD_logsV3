module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs embed`)){
			const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("ADMINISTRATOR")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `ADMINISTRATOR`"})
			const channels = JSON.parse(LoadResourceFile(GetCurrentResourceName(), '/config/channels.json'));
			const args = content.split(" ");
			if(args[2] == null || args[2] == undefined) return message.reply({content: "⛔ | You need to specify a channel.\nExample: `!jdlogs embed chat`"})
			channels[args[2]].embed = !channels[args[2]].embed
			let state = 'disabled'
			if(channels[args[2]].embed) state = 'enabled'
			const newChannels = JSON.stringify(channels)
			SaveResourceFile(GetCurrentResourceName(), '/config/channels.json', newChannels);
			channel.send({content:`✅ **|** Channel embeds have been \`${state}\`\n*Resource reload is required before changes can take effect.*`})
		}
	},
};