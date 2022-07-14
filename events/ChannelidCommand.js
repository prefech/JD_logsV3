module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
		const {channel, content} = message;
		if(content.toLowerCase().startsWith(`${client[1].config.prefix}jdlogs channelid`)){
			message.reply(`:white_check_mark: **|** The channel id for **#${channel.name}** is: \`${channel.id}\``)
		}
	},
};