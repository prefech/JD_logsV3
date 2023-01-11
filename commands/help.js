module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client.config.prefix}help`)){
			message.react("✅");
			const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("ADMINISTRATOR")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `ADMINISTRATOR`"})
			message.reply(`**Commands:**
\`${client.config.prefix}setup\` - Run the JD_logsV3 Setup.
\`${client.config.prefix}uninstall\` - Remove all channels used in JD_logsV3.
\`${client.config.prefix}create\` - Create a custom log channel.
\`${client.config.prefix}delete\` - Delete a custom log channel.
\`${client.config.prefix}hide\` - Hide something from a specific log.
\`${client.config.prefix}resethook\` - Reset the screenshot webhook.
\`${client.config.prefix}screenshot\` - Request a screenshot from a player.
\`${client.config.prefix}ss\` - Request a screenshot from a player.
`)
		}
	},
};