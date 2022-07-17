module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs screenshot`) || content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs ss`)){
			const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("MANAGE_MESSAGES")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `MANAGE_MESSAGES`"})
			const args = content.split(" ")
			emit("JD_logsV3:ScreenshotCommand", args[2], author.tag);
		}
	},
};