module.exports = {
	name: 'ready',
	once: true,
	async execute() {
        const channels = JSON.parse(LoadResourceFile(GetCurrentResourceName(), '/config/channels.json'));
        if(channels['imageStore'].channelId == ''){ return }
        const guild = await client[1].guilds.cache.get(client[1].config.tokens[1].guildID)
        const c = await guild.channels.cache.get(channels['imageStore'].channelId)
        if(!guild.me.permissions.has("MANAGE_WEBHOOKS")){ return }
        if(c === undefined){ return }            
        const hooks = await guild.fetchWebhooks();
        await hooks.forEach(async webhook => {
            if(webhook.channelId === c.id){
                webhook.delete(`Requested per JD_logs`);
            }
        });
        await c.createWebhook('Image Store Webhook', {}).then(async hook => {
            channels['imageStore'].webhookID = hook.id;
            channels['imageStore'].webhookToken = hook.token;
            console.log(`^2New Screenshot Webhook with Generated. (Old one got deleted)^0`)
        })

        const newChannels = JSON.stringify(channels, null, 2)
        SaveResourceFile(GetCurrentResourceName(), '/config/channels.json', newChannels);
        c.send(`Webhook for Image store has been Reset!`)
    }
};