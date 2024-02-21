"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_room = void 0;
var db_1 = require("../../db/db");
var helpers_1 = require("../../utils/helpers");
var create_room = function (_, ws, server) {
    var wsUser = db_1.wsUsers.get(ws);
    var roomId = (0, helpers_1.getRoomIndex)();
    if (wsUser) {
        db_1.rooms.set(roomId, [wsUser]);
        (0, helpers_1.update_room)(server);
    }
};
exports.create_room = create_room;
