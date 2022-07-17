module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {channel, content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs hide`)){
			const tUser = await message.guild.members.cache.get(author.id);
			if(!tUser.permissions.has("ADMINISTRATOR")) return message.reply({content: "⛔ | Missing Permissions to use this command.\nNeeded permission flag: `ADMINISTRATOR`"})
			const args = content.split(" ")
			if(!args[3]){ return message.reply(`Please use \`${client[1].config.prefix}jdlogs hide CHANNEL INPUT\`\nFor eaxmple: \`${client[1].config.prefix}jdlogs hide chat ip\``)}
			let status = await GetResourceKvpString(`JD_logs:${(args[2])}:${args[3]}`)
			if(status === "false" || status === null){
				status = 'true'
			} else {
				status = 'false'
			}
			await SetResourceKvp(`JD_logs:${args[2].toLowerCase()}:${args[3].toLowerCase()}`, status)
			message.reply(`:white_check_mark: **|** Updated the hide status for ${args[2]} (${args[3]}) to: \`${status}\``)
		}
	},
};