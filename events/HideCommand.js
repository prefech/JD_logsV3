module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
		const {channel, content} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs hide`)){
			const args = content.split(" ")
			if(!args[3]){ return message.reply(`Please use \`${client[1].config.prefix}jdlogs hide CHANNEL INPUT\`\nFor eaxmple: \`${client[1].config.prefix}jdlogs hide chat ip\``)}
			let status = GetResourceKvpString(`JD_logs:${(args[2])}:${args[3]}`)
			if(status === "false" || status === null){
				status = 'true'
			} else {
				status = 'false'
			}
			SetResourceKvp(`JD_logs:${args[1].toLowerCase()}:${args[2].toLowerCase()}`, status)
			message.reply(`:white_check_mark: **|** Updated the hide status for ${args[2]} (${args[3]}) to: \`${status}\``)
		}
	},
};