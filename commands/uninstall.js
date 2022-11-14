module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		const {content, guild, author} = message;
		if(content.toLowerCase().startsWith(`${client.config.prefix}uninstall`)){
			message.react("✅");
			const channels = JSON.parse(LoadResourceFile(GetCurrentResourceName(), '/config/channels.json'));
			for (const [key, value] of Object.entries(channels)) {
				let channel = await client.channels.cache.get(value.channelId);
				try{
					await channel.delete()
				} catch {}
			};
		}
	},
};