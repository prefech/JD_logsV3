local WeaponsNotLogged = {}
RegisterNetEvent('Prefech:GetNotLogged')
AddEventHandler('Prefech:GetNotLogged', function(tab)
	WeaponsNotLogged = tab
end)

RegisterNetEvent('Prefech:ClientCreateScreenshot')
AddEventHandler('Prefech:ClientCreateScreenshot', function(args)
    exports['screenshot-basic']:requestScreenshotUpload('https://discord.com/api/webhooks/'..args.url, 'files[]', function(data)
        local resp = json.decode(data)
		if resp.attachments then
            args['screenshot'] = false
            args['imageUrl'] = resp.attachments[1].url
            TriggerServerEvent('Prefech:ScreenshotCB', args)
        end
    end)
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
	TriggerServerEvent('Prefech:ClientDiscord', args)
end)

exports('createLog', function(args)
	TriggerServerEvent('Prefech:ClientDiscord', args)
end)

CreateThread(function()
	local currWeapon = 0
	local fireWeapon = nil
	local timeout = 0
	local fireCount = 0
	while true do
		Wait(0)
		local playerped = GetPlayerPed(PlayerId())
		if IsPedShooting(playerped) then
			fireWeapon = GetSelectedPedWeapon(playerped)
			fireCount = fireCount + 1
			timeout = 1000
		elseif not IsPedShooting(playerped) and fireCount ~= 0 and timeout ~= 0 then
			if timeout ~= 0 then
				timeout = timeout - 1
			end
			if fireWeapon ~= GetSelectedPedWeapon(playerped) then
				timeout = 0
			end
			if fireCount ~= 0 and timeout == 0 then
				if not ClientTables.WeaponNames[tostring(fireWeapon)] then
					TriggerServerEvent('Prefech:playerShotWeapon', '`Undefined`', fireCount)
					return
				end

				isLoggedWeapon = true
				for k,v in pairs(WeaponsNotLogged) do
					if GetSelectedPedWeapon(playerped) == GetHashKey(v) then
						isLoggedWeapon = false
					end
				end
				if isLoggedWeapon then
					TriggerServerEvent('Prefech:playerShotWeapon', ClientTables.WeaponNames[tostring(fireWeapon)], fireCount)
				end
				fireCount = 0
			end
		end
	end
end)

CreateThread(function()
	local hasRun = false
	while true do
		Wait(0)
		local iPed = PlayerPedId()
		if IsEntityDead(iPed) then
			if not hasRun then
				hasRun = true
				local kPed = GetPedSourceOfDeath(iPed)
				local cause = GetPedCauseOfDeath(iPed)
				local DeathCause = ClientTables.deatCause[cause]
				local killer = 0
				local kPlayer = NetworkGetPlayerIndexFromPed(kPed)
				Wait(1000)
				if kPlayer == PlayerId() then
					if DeathCause ~= nil then
						if DeathCause[2] ~= nil then
							DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide` (*'..DeathCause[1]..'* - *'..DeathCause[2]..'*)'
						else
							DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide` (*'..DeathCause[1]..'*)'
						end
					else
						DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide`'
					end
				elseif kPlayer == nil or kPlayer == -1 then					
					if kPed == 0 then
						if DeathCause ~= nil then
							if DeathCause[2] ~= nil then
								DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide` (*'..DeathCause[1]..'* - *'..DeathCause[2]..'*)'
							else
								DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide` (*'..DeathCause[1]..'*)'
							end
						else
							DeathReason = '**'..GetPlayerName(PlayerId())..'** `committed suicide`'
						end
					else
						if IsEntityAPed(kPed) then
							if DeathCause ~= nil then
								if DeathCause[2] ~= nil then
									DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` (*'..DeathCause[2]..'*) by **AI**'
								else
									DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` by **AI**'
								end
							else
								DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `Killed` by **AI**'
							end
						else
							if IsEntityAVehicle(kPed) then
								if IsEntityAPed(GetPedInVehicleSeat(kPed, -1)) then
									if IsPedAPlayer(GetPedInVehicleSeat(kPed, -1)) then
										killer = NetworkGetPlayerIndexFromPed(GetPedInVehicleSeat(kPed, -1))
										if DeathCause ~= nil then
											if DeathCause[2] ~= nil then
												DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` (*'..DeathCause[2]..'*) by **'..GetPlayerName(killer)..'**'
											else
												DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` by **'..GetPlayerName(killer)..'**'
											end
										else
											DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `Killed` by **'..GetPlayerName(killer)..'**'
										end
									else
										if DeathCause ~= nil then
											if DeathCause[2] ~= nil then
												DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` (*'..DeathCause[2]..'*) by **AI**'
											else
												DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` by **AI**'
											end
										else
											DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `Killed` by **AI**'
										end
									end
								else
									if DeathCause ~= nil then
										if DeathCause[2] ~= nil then
											DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` (*'..DeathCause[2]..'*) by **Unknown**'
										else
											DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` by **Unknown**'
										end
									else
										DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `Killed` by **Unknown**'
									end
								end
							end
						end
					end				
				else
					killer = NetworkGetPlayerIndexFromPed(kPed)
					if DeathCause ~= nil then
						if DeathCause[2] ~= nil then
							DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` (*'..DeathCause[2]..'*) by **'..GetPlayerName(killer)..'**'
						else
							DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `'..DeathCause[1]..'` by **'..GetPlayerName(killer)..'**'
						end
					else
						DeathReason = '**'..GetPlayerName(PlayerId())..'** has been `Killed` by **'..GetPlayerName(killer)..'**'
					end
				end
				TriggerServerEvent('Prefech:playerDied', { ['rsn'] = DeathReason, ['kil'] = GetPlayerServerId(killer) })
			end
		else
			Wait(200)
			hasRun = false
		end
	end
end)

CreateThread(function()
	local health = nil
	while true do
		Wait(0)
		if health == nil then health = GetEntityHealth(PlayerPedId()) end -- need to know the health if we gonna log the change of it ;)
		if health < GetEntityHealth(PlayerPedId()) then health = GetEntityHealth(PlayerPedId()) end -- Just to make sure we don't log when healt gets added
		if health > GetEntityHealth(PlayerPedId()) then
			newHealth = GetEntityHealth(PlayerPedId())
			TriggerServerEvent('Prefech:PlayerDamage', math.floor((health - newHealth) / 2))
			health = newHealth
			Wait(500)
		else
			Wait(1000)
		end
	end
end)