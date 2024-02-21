"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_user_to_room = void 0;
var db_1 = require("../../db/db");
var helpers_1 = require("../../utils/helpers");
var add_user_to_room = function (data, ws, server) {
    var indexRoom = JSON.parse(data).indexRoom;
    var room = db_1.rooms.get(indexRoom);
    var user = db_1.wsUsers.get(ws);
    if (!user || !room)
        return;
    var index = room[0].index;
    if (index !== user.index) {
        room.push(user);
        db_1.closedRooms.set(indexRoom, room);
        db_1.rooms.delete(indexRoom);
        (0, helpers_1.update_room)(server);
        (0, helpers_1.create_game)(room);
    }
};
exports.add_user_to_room = add_user_to_room;
