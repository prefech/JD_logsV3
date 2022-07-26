--[[
    #####################################################################
    #                _____           __          _                      #
    #               |  __ \         / _|        | |                     #
    #               | |__) | __ ___| |_ ___  ___| |__                   #
    #               |  ___/ '__/ _ \  _/ _ \/ __| '_ \                  #
    #               | |   | | |  __/ ||  __/ (__| | | |                 #
    #               |_|   |_|  \___|_| \___|\___|_| |_|                 #
    #                                                                   #
    #                         www.prefech.com                           #
    #                                                                   #
    #####################################################################
]]


version '3.0.4'
author 'Prefech'
description 'FXServer logs to Discord (https://prefech.com/)'
repository 'https://github.com/prefech/JD_logsV3'


dependency 'yarn'
dependency 'screenshot-basic'

-- Server Scripts
server_scripts {
    'server/playerDetails.lua',
    'server/main.lua',
    'server/txAdminEvents.lua',
    'index.js'
}

--Client Scripts
client_scripts {
    'client/clientTables.lua',
    'client/main.lua'
}

lua54 'yes'
game 'gta5'
fx_version 'cerulean'