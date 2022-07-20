local channelsLoadFile = LoadResourceFile(GetCurrentResourceName(), "./config/channels.json")
local channelFile = json.decode(channelsLoadFile)

local configLoadFile = LoadResourceFile(GetCurrentResourceName(), "./config/config.json")
local cfgFile = json.decode(configLoadFile)

CreateThread(function()
	if cfgFile['tokens']['1'].token == '' then
		print('^1Error: You need to set at least one bot token.^0')
		return StopResource(GetCurrentResourceName())
	end
   	if channelFile['newInstall'] then
		print('^2Please use the ^1!jdlogs setup ^2command on discord to finish the installation.^0')
		return StopResource(GetCurrentResourceName())
   	end
end)

RegisterCommand('jdlogs', function(source, args, RawCommand)
	if source == 0 then
		if args[1]:lower() == "hide" then
            if not args[3] then return print("^1Error: Please use 'jdlogs hide [channel] [object]'^0") end
            if channelFile[args[2]:lower()] then
                state = GetResourceKvpString("JD_logs:"..args[2]:lower()..":"..args[3]:lower())
                if state == 'false' or state == nil then _state = 'true' else _state = 'false' end
                SetResourceKvp("JD_logs:"..args[2]:lower()..":"..args[3]:lower(), _state)
                print('^5[JD_logs]^1: Updated the hide status for '..args[2]:lower()..' ('..args[3]:lower()..') to: '.._state..'^0')
            else
                print("^1Error: Channel "..args[2]:lower().." does not exist. (Make sure to add it to your channels.json before using this command.)^0")
            end
        end
	end
end)

exports('discord', function(msg, player_1, player_2, color, channel)
	args ={
		['EmbedMessage'] = msg,
		['color'] = color,
		['channel'] = channel
	}
	if player_1 ~= 0 then
		args['player_id'] = player_1
	end
	if player_2 ~= 0 then
		args['player_2_id'] = player_2
	end
	CreateLog(args)
end)

exports('createLog', function(args)
	CreateLog(args)
end)

exports('GetPlayers', function(args)
	return GetPlayers()
end)

RegisterCommand('screenshot', function(source, args, RawCommand)
	if source == 0 then
		TriggerEvent("JD_logsV3:ScreenshotCommand", args[1], 'Console')
	else
		if IsPlayerAceAllowed(source, cfgFile['screenshotPerms']) then
			TriggerEvent("JD_logsV3:ScreenshotCommand", args[1], GetPlayerName(source))
		end
	end
end)

RegisterNetEvent("JD_logsV3:ScreenshotCommand")
AddEventHandler("JD_logsV3:ScreenshotCommand", function(tId, src)
	CreateLog({
		EmbedMessage = "**Screenshot of:** `"..GetPlayerName(tId).."`\n**Requested by:** `"..src.."`",
		player_id = tId,
		channel = "screenshot",
		screenshot = true
	})
end)

AddEventHandler("playerJoining", function(source, oldID)
	CreateLog({EmbedMessage = ("**%s** has joined the server."):format(GetPlayerName(source)), player_id = source, channel = 'join'})
	TriggerClientEvent('Prefech:GetNotLogged', source, cfgFile['WeaponsNotLogged'])
	local ids = ExtractIdentifiers(source)
	local oldName = GetResourceKvpString("JD_logs:nameChane:"..ids.license)
	if oldName == nil then
		SetResourceKvp("JD_logs:nameChane:"..ids.license, GetPlayerName(source))
	else
		if oldName ~= GetPlayerName(source) then
			CreateLog({EmbedMessage = ("**Name Change Detected**\n`%s` :arrow_right: `%s`"):format(oldName, GetPlayerName(source)), player_id = source, channel = 'nameChange'})
			SetResourceKvp("JD_logs:nameChane:"..ids.license, GetPlayerName(source))
			for k,v in pairs(GetPlayers()) do
				if IsPlayerAceAllowed(v, cfgFile['NameChangePerms']) then
					TriggerClientEvent('chat:addMessage', i, {
						template = '<div style="background-color: rgba(90, 90, 90, 0.9); text-align: center; border-radius: 0.5vh; padding: 0.7vh; font-size: 1.7vh;"><b>Player ^1{0} ^0{1} ^1{2}</b></div>',
						args = { ("**Name Change Detected** `%s` -> `%s`"):format(GetPlayerName(source), oldName) }
					})
				end
			end
		end
	end
end)

CreateThread(function()
	PerformHttpRequest('https://raw.githubusercontent.com/Prefech/JD_logsV3/master/json/version.json', function(code, res, headers)
		if code == 200 then
			local rv = json.decode(res)
			SetConvarServerInfo("JD_logs", "V"..GetResourceMetadata(GetCurrentResourceName(), 'version'))
			if rv.version ~= GetResourceMetadata(GetCurrentResourceName(), 'version') then
				print('^5[JD_logs] ^1Error: ^0JD_logsV3 is outdated and you will no longer get support for this version.')
			end
		end
	end, 'GET')
end)

RegisterCommand('fakeName', function(source, args, RawCommand)
	local ids = ExtractIdentifiers(source)
	SetResourceKvp("JD_logs:nameChane:"..ids.license, 'MyFakeName')
end)

CreateThread(function()
	TriggerClientEvent('Prefech:GetNotLogged', -1, cfgFile['WeaponsNotLogged']) -- Just sync the table in case of resource restart.
end)

AddEventHandler('playerDropped', function(reason)
	CreateLog({EmbedMessage = ("**%s** has left the server.\nReason: `%s`"):format(GetPlayerName(source), reason), player_id = source, channel = 'leave'})
end)

AddEventHandler('chatMessage', function(source, name, msg)
    local _source = source
    if msg:sub(1, 1) ~= '/' then
        CreateLog({ channel = 'chat', EmbedMessage = ('**%s:** `%s`'):format(GetPlayerName(_source), msg), player_id = _source })
    end
end)

AddEventHandler('explosionEvent', function(source, ev)
    local explosionTypes = {'GRENADE', 'GRENADELAUNCHER', 'STICKYBOMB', 'MOLOTOV', 'ROCKET', 'TANKSHELL', 'HI_OCTANE', 'CAR', 'PLANE', 'PETROL_PUMP', 'BIKE', 'DIR_STEAM', 'DIR_FLAME', 'DIR_GAS_CANISTER', 'BOAT', 'SHIP_DESTROY', 'TRUCK', 'BULLET', 'SMOKEGRENADELAUNCHER', 'SMOKEGRENADE', 'BZGAS', 'FLARE', 'GAS_CANISTER', 'EXTINGUISHER', 'PROGRAMMABLEAR', 'TRAIN', 'BARREL', 'PROPANE', 'BLIMP', 'DIR_FLAME_EXPLODE', 'TANKER', 'PLANE_ROCKET', 'VEHICLE_BULLET', 'GAS_TANK', 'BIRD_CRAP', 'RAILGUN', 'BLIMP2', 'FIREWORK', 'SNOWBALL', 'PROXMINE', 'VALKYRIE_CANNON', 'AIR_DEFENCE', 'PIPEBOMB', 'VEHICLEMINE', 'EXPLOSIVEAMMO', 'APCSHELL', 'BOMB_CLUSTER', 'BOMB_GAS', 'BOMB_INCENDIARY', 'BOMB_STANDARD', 'TORPEDO', 'TORPEDO_UNDERWATER', 'BOMBUSHKA_CANNON', 'BOMB_CLUSTER_SECONDARY', 'HUNTER_BARRAGE', 'HUNTER_CANNON', 'ROGUE_CANNON', 'MINE_UNDERWATER', 'ORBITAL_CANNON', 'BOMB_STANDARD_WIDE', 'EXPLOSIVEAMMO_SHOTGUN', 'OPPRESSOR2_CANNON', 'MORTAR_KINETIC', 'VEHICLEMINE_KINETIC', 'VEHICLEMINE_EMP', 'VEHICLEMINE_SPIKE', 'VEHICLEMINE_SLICK', 'VEHICLEMINE_TAR', 'SCRIPT_DRONE', 'RAYGUN', 'BURIEDMINE', 'SCRIPT_MISSIL'}
    if ev.explosionType < -1 or ev.explosionType > 77 then
        ev.explosionType = 'UNKNOWN'
    else
        ev.explosionType = explosionTypes[ev.explosionType + 1]
    end
    CreateLog({EmbedMessage = ("**%s** created an explotion: `%s`"):format(GetPlayerName(source), ev.explosionType), player_id = source, channel = 'explosion'})
end)

AddEventHandler('onResourceStop', function (resourceName)
	CreateLog({EmbedMessage = ("`%s` has been stopped."):format(resourceName), channel = 'resource'})
end)

RegisterNetEvent('printDebug')
AddEventHandler("printDebug", function(txt)
	print('Debug'..txt)
end)

AddEventHandler('onResourceStart', function (resourceName)
    Wait(100)
	CreateLog({EmbedMessage = ("`%s` has been started."):format(resourceName), channel = 'resource'})
end)

RegisterServerEvent('Prefech:playerDied')
AddEventHandler('Prefech:playerDied',function(args)
	if args.kil == 0 then
		CreateLog({EmbedMessage = args.rsn, player_id = source, channel = 'death'})
	else
		CreateLog({EmbedMessage = args.rsn, player_id = source, player_2_id = args.kil, channel = 'death'})
	end
end)

RegisterServerEvent('Prefech:playerShotWeapon')
AddEventHandler('Prefech:playerShotWeapon', function(weapon, count)
	if cfgFile['weaponLog'] then
		if count ~= nil then
    		CreateLog({EmbedMessage = ("**%s** fired a **%s** `%s time(s)`."):format(GetPlayerName(source), weapon, count), player_id = source, channel = 'shooting'})
		else
			CreateLog({EmbedMessage = ("**%s** fired a **%s**."):format(GetPlayerName(source), weapon, count), player_id = source, channel = 'shooting'})
		end
	end
end)

RegisterNetEvent("Prefech:ScreenshotCB")
AddEventHandler("Prefech:ScreenshotCB", function(args)
	CreateLog(args)
end)

RegisterServerEvent('Prefech:ClientDiscord')
AddEventHandler('Prefech:ClientDiscord', function(args)
	CreateLog(args)
end)

CreateThread(function()
    Wait(10 * 1000)
    while true do
        PerformHttpRequest('https://cdn.prefech.dev/api/systemMessage.json', function(code, res, headers)
            if code == 200 then
                local rv = json.decode(res)
                lastSend = GetResourceKvpString("JD_logs:SystemMessage")
                if rv.UUID ~= lastSend then
                    print('**'..rv.title..'**\n'..rv.description)
                    CreateLog({ EmbedMessage = '**'..rv.title..'**\n'..rv.description, channel = 'system'})
                    SetResourceKvp("JD_logs:SystemMessage", rv.UUID)
                end
            end
        end, 'GET')
        Wait(15 * 60 * 1000)
    end
end)

local storage = nil
RegisterNetEvent('Prefech:sendClientLogStorage')
AddEventHandler('Prefech:sendClientLogStorage', function(_storage)
	storage = _storage
end)

function CreateLog(args)
    if args.screenshot then
        if not args.player_id then
            print('can not make a screenshot if there is no know player id.')
        else
			local channelsLoadFile = LoadResourceFile(GetCurrentResourceName(), "./config/channels.json")
			local theFile = json.decode(channelsLoadFile)
            args['url'] = theFile['imageStore'].webhookID.."/"..theFile['imageStore'].webhookToken
            return TriggerClientEvent('Prefech:ClientCreateScreenshot', args.player_id, args)
        end
    end
    info = {
        channel = args.channel,
        msg = args.EmbedMessage,
    }

    if args.player_id ~= nil then
        info.player_1 = {
            title = "Player Details: "..GetPlayerName(args.player_id),
            info = GetPlayerDetails(args.player_id, args.channel)
        }
    end

    if args.player_2_id  ~= nil then
        info.player_2 = {
            title = "Player Details: "..GetPlayerName(args.player_2_id),
            info = GetPlayerDetails(args.player_2_id, args.channel)
        }
    end
    if args.imageUrl then
        info.imageUrl = args.imageUrl;
    end
    if channelFile[args.channel].client then
        info.client = channelFile[args.channel].client
    else
        info.client = 1
    end

    exports['JD_logsV3']:sendEmbed(info)
end

-- version check
CreateThread( function()
	local version = GetResourceMetadata(GetCurrentResourceName(), 'version')
	SetConvarServerInfo("JD_logs", "V"..version)
	PerformHttpRequest('https://raw.githubusercontent.com/Prefech/JD_logsV3/master/json/version.json', function(code, res, headers)
		if code == 200 then
			local rv = json.decode(res)
			if rv.version ~= version then
					print(([[^1-------------------------------------------------------
					JD_logsV3
UPDATE: %s AVAILABLE
CHANGELOG: %s
-------------------------------------------------------^0]]):format(rv.version, rv.changelog))
				CreateLog({ EmbedMessage = "**JD_logsV3 Update V"..rv.version.."**\nDownload the latest update of JD_logs here:\nhttps://github.com/prefech/JD_logs3/releases/latest\n\n**Changelog:**\n"..rv.changelog, channel = 'system'})
			end
		end
	end, 'GET')
end)