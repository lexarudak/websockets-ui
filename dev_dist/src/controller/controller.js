"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
// import { WebSocket } from 'ws';
var reg_1 = require("./commands/reg");
var add_user_to_room_1 = require("./commands/add_user_to_room");
var create_room_1 = require("./commands/create_room");
var add_ships_1 = require("./commands/add_ships");
exports.controller = {
    reg: reg_1.reg,
    create_room: create_room_1.create_room,
    add_user_to_room: add_user_to_room_1.add_user_to_room,
    add_ships: add_ships_1.add_ships,
};
