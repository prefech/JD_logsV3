module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs channelid`)){
			const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("ADMINISTRATOR")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `ADMINISTRATOR`"})
			message.reply(`:white_check_mark: **|** The channel id for **#${channel.name}** is: \`${channel.id}\``)
		}
	},
};