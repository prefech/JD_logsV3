<h4 align="center">
	<img src="https://img.shields.io/github/release/Prefech/JD_logs.png">
	<img src="https://img.shields.io/github/last-commit/Prefech/JD_logs">
	<img src="https://img.shields.io/github/license/Prefech/JD_logs.png">
	<img src="https://img.shields.io/github/issues/Prefech/JD_logs.png">
	<img src="https://img.shields.io/github/contributors/Prefech/JD_logs.png">
	<a href="https://discord.gg/prefech" title=""><img alt="Discord Status" src="https://discordapp.com/api/guilds/721339695199682611/widget.png"></a>
</h4>

<div align="center">
  <a href="https://github.com/Prefech/JD_logs">
    <img src="https://prefech.com/i/JD_logsV3">
  </a>

  <h1 align="center">JD_logsV3</h1>

  <p align="center">
    New JD_logs Server logger.
    <br />    
    <a href="https://discord.gg/5WJGmFQUjt">Report Bug</a>
    ·
    <a href="https://discord.gg/E9FceTnsJV">Request Feature</a>
    ·
    <a href="https://docs.prefech.com/JD_logsV3/">Documentation</a>
  </p>
  <a href="https://discord.gg/prefech" title=""><img alt="Discord Invite" src="https://discordapp.com/api/guilds/721339695199682611/widget.png?style=banner2"></a>
</div>



### 🛠 Requirements

- FXServer With at least build: `5562`
- screenshot-basic
- A Discord Server

### ✅ Main Features
- Basic logs:
    - Chat Logs (Messages typed in chat.)
    - Join Logs (When i player is connecting to the sever.)
    - Leave Logs (When a player disconnects from the server.)
    - Death Logs (When a player dies/get killed.)
    - Shooting Logs (When a player fires a weapon.)
    - Resource Logs (When a resouce get started/stopped.)
    - Explotion Logs (When a player creates an explotion.)
    - Namechange Logs (When someone changes their steam name.)
- Screenshot Logs (You can add screenshot of the players game to your logs.)
- Optional custom logs
    - Easy to add with the export.

### 🔧 Download & Installation

1. Download the latest version from github: https://github.com/prefech/JD_logsV3/releases/latest
2. Put the JD_logsV3 folder in the server resource directory
    - Make sure to rename the folder to JD_logsV3.
3. Get yourself the bot token(s) and add them in the config/config.json
    - Not sure how to get a bot token? [How to get a bot token](https://forum.prefech.com/d/12-how-to-get-a-discord-bot-token).
    - The bots need to have the following intents enabled:
        - Presence Intent
        - Server Members Intent
        - Message Content Intent
4. Add this to your server.cfg
```cfg
ensure JD_logsV3
```
5. Start the resource once and let it build.
6. Go to your discord where you invited the bot (The one where you want your new main logs to be.) 7. and use the command !jdlogs setup.
    - Make sure the first bot (The one with the token at 1) has permissions to send messages, create channels and create webhooks.
    - All other bots just need permission to send messages in the channels.
7. Restart your server and you will see the logs on your discord.

Info | |
--- | --- |
Code is accessible | Yes
Requirements | [Yes](https://github.com/prefech/JD_logsV3#-requirements)
Documentation | [Here](https://docs.prefech.com/jd_logsv3/)
Support	| Yes, we have a [Discord](https://discord.gg/prefech) server at your disposal