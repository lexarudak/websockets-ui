"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitField = exports.create_game = exports.update_room = exports.update_winners = exports.getRoomsJson = exports.sendToAll = exports.createUser = exports.getGameIndex = exports.getRoomIndex = exports.getIndex = void 0;
var db_1 = require("../db/db");
var counter = function () {
    var id = 0;
    return function () {
        id++;
        return id;
    };
};
exports.getIndex = counter();
exports.getRoomIndex = counter();
exports.getGameIndex = counter();
var createUser = function (name, password, ws) {
    var newUser = {
        index: (0, exports.getIndex)(),
        name: name,
        password: password,
        ws: ws,
    };
    db_1.db.set(name, newUser);
    db_1.wsUsers.set(ws, {
        index: newUser.index,
        name: name,
        ws: ws,
    });
    return newUser;
};
exports.createUser = createUser;
var sendToAll = function (type, data, server) {
    var req = {
        type: type,
        id: 0,
        data: data,
    };
    server.clients.forEach(function (client) {
        client.send(JSON.stringify(req));
    });
};
exports.sendToAll = sendToAll;
var getRoomsJson = function (roomsArr) {
    return JSON.stringify(roomsArr.map(function (_a) {
        var roomId = _a[0], roomUsers = _a[1];
        return {
            roomId: roomId,
            roomUsers: roomUsers,
        };
    }));
};
exports.getRoomsJson = getRoomsJson;
var update_winners = function (server) {
    (0, exports.sendToAll)('update_winners', JSON.stringify(db_1.winners), server);
};
exports.update_winners = update_winners;
var update_room = function (server) {
    var roomsArr = Array.from(db_1.rooms);
    (0, exports.sendToAll)('update_room', roomsArr.length ? (0, exports.getRoomsJson)(roomsArr) : '[]', server);
};
exports.update_room = update_room;
var create_game = function (room) {
    var idGame = (0, exports.getGameIndex)();
    db_1.games.set(idGame, room);
    room.forEach(function (_a, ind) {
        var ws = _a.ws;
        if (ws) {
            ws.send(JSON.stringify({
                type: 'create_game',
                id: 0,
                data: JSON.stringify({
                    idGame: idGame,
                    idPlayer: ind,
                }),
            }));
        }
    });
};
exports.create_game = create_game;
var addShip = function (x, y, length, direction) {
    var set = new Set();
    for (var i = 0; i < length; i++) {
        set.add(x + y * 10 + (direction ? i * 10 : i));
    }
    return set;
};
var getInitField = function (ships) {
    return ships.map(function (_a) {
        var _b = _a.position, x = _b.x, y = _b.y, direction = _a.direction, length = _a.length;
        return addShip(x, y, length, direction);
    });
};
exports.getInitField = getInitField;
